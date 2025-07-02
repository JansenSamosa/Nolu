import sys
"""
This module defines a Flask application for a daily-assisted journal backend. It provides
endpoints for managing users, moods, prompts, and journal entries. The application interacts
with a database using SQLAlchemy models.
Functions:
----------
seed_initial_data(db):
    Seeds the database with initial data for journal prompts and moods.
create_app(app_config=None):
    Creates and configures the Flask application instance.
Routes:
-------
GET /users/<id>:
    Retrieves user information by user ID.
GET /users/<id>/streak:
    Retrieves streak information for a user by user ID.
POST /users:
    Adds a new user to the database.
GET /moods:
    Retrieves all available moods.
GET /prompts:
    Retrieves all available journal prompts.
GET /entries:
    Retrieves journal entries within a specified date range.
POST /entries:
    Adds new journal entries to the database.
Usage:
------
Run the script to start the Flask application. The database is initialized, and sample data
is seeded for testing purposes. Use the provided endpoints to interact with the application.
"""
import os
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, User, UserStreak, Prompt, Mood, Entry, EntryFreeData, EntryMoodData, EntryPromptData
from uuid import uuid4
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from datetime import datetime
import json

import firebase_admin
from firebase_admin import auth

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

    try:
        app_firebase = firebase_admin.initialize_app()
    except ValueError:
        app_firebase = firebase_admin.get_app()

    def decode_auth_token():
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        id_token = auth_header.split("Bearer ")[1]

        try:
            decoded_token = auth.verify_id_token(id_token)
        except Exception as e:
            return None

        return decoded_token

    @app.route("/user", methods=["GET"])
    def get_user():
        decoded_token = decode_auth_token()
        if not decoded_token:
            return jsonify({"message": 'Unauthorized'}), 401

        id = decoded_token['uid']
        email = decoded_token['email']

        query = select(User).where(User.id == id)
        user = db.session.execute(query).scalar_one_or_none()

        if not user:
            try:
                # create user data
                new_user = User(id=id, email=email)
                new_user_streak = UserStreak(id=id)

                db.session.add(new_user)
                db.session.add(new_user_streak)
                db.session.commit()
            except:
                return jsonify({"message": 'Error intializing user'}, 500)

            user = new_user
        return (jsonify(
            {
                "email": email,
                "createdAt": user.created_at
            }
        ), 200)

    @app.route("/streak", methods=['GET'])
    def get_streak():
        decoded_token = decode_auth_token()
        if not decoded_token:
            return jsonify({"message": 'Unauthorized'}), 401
        id = decoded_token['uid']

        query = select(UserStreak).where(UserStreak.id == id)
        user_streak = db.session.execute(query).scalar_one_or_none()

        if not user_streak:
            return jsonify({'message': 'User streak data does not exist. Please initialize the user first'}), 400

        return jsonify({
            'streak': user_streak.streak,
            'lastStreakDate': user_streak.last_streak_date
        }), 200

    @app.route('/streak', methods=['PATCH'])
    def patch_streak():
        decoded_token = decode_auth_token()
        if not decoded_token:
            return jsonify({"message": 'Unauthorized'}), 401
        id = decoded_token['uid']

        data = request.get_json()
        last_streak_date = datetime.fromisoformat(data['lastStreakDate'])
        
        # get the previous last streak day
        query = select(UserStreak).where(UserStreak.id == id)
        user_streak = db.session.execute(query).scalar_one_or_none()

        if not user_streak:
            return jsonify({'message': 'User streak data does not exist. Please initialize the user first'}), 400

        prev_last_streak_date = user_streak.last_streak_date

        # logic for 0 day difference, 1 day difference, 2 or mmore day difference
        days_difference = (last_streak_date.date() - prev_last_streak_date.date()).days
        if days_difference == 1:
            user_streak.streak += 1
        elif days_difference >= 2:
            user_streak.streak = 1

        user_streak.last_streak_date = last_streak_date
        db.session.add(user_streak)
        db.session.commit()

        return jsonify({
            'streak': user_streak.streak,
            'lastStreakDate': user_streak.last_streak_date
        }), 200

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
        decoded_token = decode_auth_token()
        if not decoded_token:
            return jsonify({"message": 'Unauthorized'}), 401

        user_id = decoded_token['uid']

        start_date = datetime.strptime(request.args.get(
            "start"), '%Y-%m-%d').replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = datetime.strptime(request.args.get(
            "end"), '%Y-%m-%d').replace(hour=23, minute=59, second=59, microsecond=999999)

        query = (
            select(Entry, EntryMoodData, EntryPromptData, EntryFreeData)
            .outerjoin(EntryMoodData, EntryMoodData.id == Entry.id)
            .outerjoin(EntryPromptData, EntryPromptData.id == Entry.id)
            .outerjoin(EntryFreeData, EntryFreeData.id == Entry.id)
            .where(
                Entry.user_id == user_id,
                Entry.created_at >= start_date,
                Entry.created_at <= end_date
            )
        )

        results = db.session.execute(query).all()

        entries = []
        for entry, mood_data, prompt_data, free_data in results:
            e = {
                'type': entry.type,
                'createdAt': str(entry.created_at)
            }

            if mood_data:
                e['data'] = {'selectedMood': mood_data.selected_mood,
                             'userResponse': mood_data.user_response}
            if prompt_data:
                e['data'] = {'promptText': prompt_data.prompt_text,
                             'userResponse': prompt_data.user_response}
            if free_data:
                e['data'] = {'userResponse': free_data.user_response}

            entries.append(e)

        return (
            jsonify({'entries': entries}),
            200
        )

    @app.route("/entries", methods=['POST'])
    def add_entries():
        decoded_token = decode_auth_token()
        if not decoded_token:
            return jsonify({"message": 'Unauthorized'}), 401

        user_id = decoded_token['uid']
        data = request.get_json()

        entries = []
        entries_mood_data = []
        entries_prompt_data = []
        entries_free_data = []

        # create entry objects
        for entry in data:
            id = uuid4()

            t = entry['type']
            try:
                # TODO: add user_id field when auth is implemented
                new_entry = Entry(
                    id=id,
                    user_id=user_id,
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
        db.drop_all()  # Drop all tables for TESTING
        db.create_all()
        seed_initial_data(db)

    app.run(debug=True, port=5000)

    # add some sample entries for testing purposes with backend
