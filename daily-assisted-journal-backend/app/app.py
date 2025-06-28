import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from app.models import db, User

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

    @app.route("/users", methods=["GET"])
    def get_users():
        users = User.query.all()
        return (
            jsonify(
                [
                    {"id": user.id, "name": user.name, "email": user.email, "created_at": user.created_at}
                    for user in users
                ]
            ),
            200,
        )
    
    @app.route("/users", methods=["POST"])
    def add_user():
        data = request.get_json()
        new_user = User(name=data["name"], email=data["email"])
        db.session.add(new_user)
        db.session.commit()
        return ( jsonify({"message": "User created"}), 201)
    
    

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)