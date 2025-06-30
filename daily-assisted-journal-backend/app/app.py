import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + '/..'))

import os
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dotenv import load_dotenv
from app.models import db, User, UserStreak, Prompt, Mood, Entry, EntryFreeData, EntryMoodData, EntryPromptData
from uuid import uuid4
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from datetime import datetime
import json

journal_prompts = [
    "What is one thing that went well today, and why?",
    "What challenged you today, and how did you respond?",
    "What are three things you're grateful for right now?",
    "Did you do something today that aligned with your values?",
    "How did you take care of your mental or physical health today?",
    "What moment today made you feel most alive?",
    "What emotion did you feel most strongly today, and what triggered it?",
    "Who did you connect with today, and how did that interaction feel?",
    "What’s one thing you could have done differently today?",
    "What did you learn about yourself this week?",
    "When did you feel most proud of yourself recently?",
    "What habits are helping you right now? Which ones are holding you back?",
    "If today were a chapter in your life story, what would the title be?",
    "What do you want to remember about this week?",
    "What’s something you're avoiding, and why?",
    "What does your ideal day look like? How close was today to that?",
    "If you had to relive one moment from today, which would it be and why?",
    "What are you currently working toward, and how do you feel about your progress?",
    "How have you grown or changed in the last month?",
    "What do you want tomorrow to feel like, and what can you do to move in that direction?"
]

moods = ["😞", "😔", "😐", "🙂", "😄"]

# should be called under 'with app.app_context()' after db.create_all()
def seed_initial_data(db):
    # add all journal prompts to db if not already added
    for text in journal_prompts:    
        try:
            db.session.add(Prompt(prompt_text=text))
            db.session.commit()
        except IntegrityError:
            db.session.rollback()

    # add all moods to db if not already added
    for text in moods:
        try:
            db.session.add(Mood(mood_text=text))
            db.session.commit()
        except IntegrityError:
            db.session.rollback()

def create_app(app_config=None):
    load_dotenv()

    app = Flask(__name__)
    CORS(app)

    DATABASE_URI = os.getenv("DATABASE_URI", "sqlite:///:memory:")

    if app_config:
        app.config.update(app_config)
    else:
        app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    @app.route("/users/<id>", methods=["GET"])
    def get_user(id):
        query = select(User).where(User.id == id)
        user = db.session.execute(query).scalar_one_or_none()

        if not user:
            return (jsonify({'message': 'Cound not find user'}), 400)

        return (jsonify(
            {
                "name": user.name,
                "email": user.email,
                "createdAt": user.created_at
            }
        ), 200)

    @app.route("/users/<id>/streak", methods=["get"])
    def get_user_streak(id):
        query = select(UserStreak).where(UserStreak.id == id)
        userStreak = db.session.execute(query).scalar_one_or_none()

        if not userStreak:
            return (jsonify({'message': 'Could not find the users streak data'}), 400)

        return (jsonify(
            {
                'streak': userStreak.streak,
                'highestStreak': userStreak.highest_streak,
                'lastStreakDate': userStreak.last_streak_date
            }
        ), 200)

    @app.route("/users", methods=["POST"])
    def add_user():
        data = request.get_json()
        id = uuid4()
        new_user = User(id=id, name=data["name"], email=data["email"])
        new_user_streak = UserStreak(id=id)

        db.session.add(new_user)
        db.session.add(new_user_streak)
        db.session.commit()
        return (jsonify({"message": "User created", "id": id.__str__()}), 201)

    @app.route("/moods", methods=['GET'])
    def get_moods():
        query = select(Mood.mood_text)
        res = db.session.execute(query).all()
        all_moods = [row[0] for row in res]

        if not all_moods:
            return (jsonify({"message": 'Moods could not be found'}), 400)

        return (jsonify({"moods": all_moods}), 200)

    @app.route("/prompts", methods=['GET'])
    def get_prompts():
        query = select(Prompt.prompt_text)
        res = db.session.execute(query).all()
        all_prompts = [row[0] for row in res]

        if not all_prompts:
            return (jsonify({"message": 'Moods could not be found'}), 400)

        return (jsonify({"prompts": all_prompts}), 200)

    @app.route("/entries", methods=['GET'])
    def get_entries():
        start_date = datetime.strptime(request.args.get("start"), '%Y-%m-%d').replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = datetime.strptime(request.args.get("end"), '%Y-%m-%d').replace(hour=23, minute=59, second=59, microsecond=999999)
        
        query = (
            select(Entry, EntryMoodData, EntryPromptData, EntryFreeData)
            .outerjoin(EntryMoodData, EntryMoodData.id == Entry.id)
            .outerjoin(EntryPromptData, EntryPromptData.id == Entry.id)
            .outerjoin(EntryFreeData, EntryFreeData.id == Entry.id)
            .where(Entry.created_at >= start_date, Entry.created_at <= end_date)
        )

        results = db.session.execute(query).all()

        entries = []
        for entry, mood_data, prompt_data, free_data in results:
            e = {
                'type': entry.type,
                'createdAt': str(entry.created_at)
            }
            
            if mood_data:
                e['data'] = { 'selectedMood': mood_data.selected_mood, 'userResponse': mood_data.user_response }
            if prompt_data:
                e['data'] = { 'promptText': prompt_data.prompt_text, 'userResponse': prompt_data.user_response }
            if free_data:
                e['data'] = { 'userResponse': free_data.user_response }

            entries.append(e)

        return (
            jsonify({ 'entries': entries }),
            200
        )
    
    @app.route("/entries", methods=['POST'])
    def add_entries():
        data = request.get_json()

        entries = []
        entries_mood_data = []
        entries_prompt_data = []
        entries_free_data = []

        for entry in data:
            id = uuid4()
            
            t = entry['type']
            try:
                # TODO: add user_id field when auth is implemented
                new_entry = Entry(
                    id=id, 
                    created_at=entry['createdAt'], 
                    type=t
                )

                if t == 'mood':
                    new_entry_data = EntryMoodData(
                        id=id,
                        selected_mood=entry['data']['selectedMood'],
                        user_response=entry['data']['userResponse']
                    )
                    entries_mood_data.append(new_entry_data)
                elif t == 'prompt':
                    new_entry_data = EntryPromptData(
                        id=id,
                        prompt_text=entry['data']['promptText'],
                        user_response=entry['data']['userResponse']
                    )
                    entries_prompt_data.append(new_entry_data)
                elif t == 'free':
                    new_entry_data = EntryFreeData(
                        id=id,
                        user_response=entry['data']['userResponse']
                    )
                    entries_free_data.append(new_entry_data)
                else:
                    continue
                
                entries.append(new_entry)
            except Exception as e:
                return (jsonify({'message': 'Failed: at least one entry is malformed; ' + str(e)}), 400)

        try:
            db.session.add_all(entries)
            db.session.add_all(entries_mood_data)
            db.session.add_all(entries_prompt_data)
            db.session.add_all(entries_free_data)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return (jsonify({'message': 'Failed: db transaction errored'}), 400)

        return (
            jsonify({'message': 'All entries successfully added'}), 
            201
        )
    
    return app



if __name__ == "__main__":
    app = create_app()

    with app.app_context():
        db.create_all()
        seed_initial_data(db)

        cur_date_str = str(datetime.now())
        sample_entries = [
            {
                "type": "mood",
                "createdAt": cur_date_str,
                "data": {
                    "selectedMood": "😌",
                    "userResponse": "Because yada yada yada"
                }
            },
                {
                "type": "prompt",
                "createdAt": cur_date_str,
                "data": {
                    "promptText": "What’s one small win you had today?",
                    "userResponse": "One small win I had today was ur mom"
                }
            },
                {
                "type": "free",
                "createdAt": cur_date_str,
                "data": {
                    "userResponse": "I am feeling yada this is some long text im writing."
                }
            }
        ]
        print(cur_date_str)
        with app.test_client() as client:
            res = client.post(
                '/entries', data=json.dumps(sample_entries), content_type='application/json'
            )
            print(res.get_json())

    app.run(debug=True, port=8000)

    # add some sample entries for testing purposes with backend

