from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, DateTime, UUID, ForeignKey, func
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship
from datetime import datetime
from uuid import UUID, uuid4

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# ADMIN ONLY CONFIGURABLE DATA ---------------

class Prompt(db.Model):
    __tablename__ = 'prompts'

    id: Mapped[int] = mapped_column(primary_key=True)
    prompt_text: Mapped[str] = mapped_column(nullable=False, unique=True)

class Mood(db.Model):
    __tablename__ = 'moods'

    id: Mapped[int] = mapped_column(primary_key=True)
    mood_text: Mapped[str] = mapped_column(nullable=False, unique=True)

# --------------- ADMIN ONLY CONFIGURABLE DATA 

class User(db.Model):
    __tablename__ = 'users'

    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=True)
    email: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(nullable=False, default=func.now())

    entries: Mapped[list["Entry"]] = relationship("Entry", back_populates="user")

    user_streak: Mapped["UserStreak"] = relationship("UserStreak", back_populates="user")

    def __repr__(self):
        return f"User {self.name}"

default_date = datetime(1999, 1, 1, 0, 0, 0)

class UserStreak(db.Model):
    __tablename__ = 'user_streak'

    id: Mapped[UUID] = mapped_column(ForeignKey('users.id'), primary_key=True)
    streak : Mapped[int] = mapped_column(default=0)
    last_streak_date : Mapped[datetime] = mapped_column(default=default_date)

    highest_streak : Mapped[int] = mapped_column(default=0)

    user: Mapped["User"] = relationship("User", back_populates="user_streak")

# JOURNAL ENTRY DATA TABLES -------------------

class Entry(db.Model):
    __tablename__ = 'entries'

    id: Mapped[UUID] = mapped_column(primary_key=True)

    user_id: Mapped[str] = mapped_column(ForeignKey('users.id'), nullable=False) 
    created_at: Mapped[datetime] = mapped_column(nullable=False, default=func.now())
    type: Mapped[str] = mapped_column(nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="entries")

    mood_data: Mapped["EntryMoodData"] = relationship("EntryMoodData", back_populates="entry", uselist=False)
    prompt_data: Mapped["EntryPromptData"] = relationship("EntryPromptData", back_populates="entry", uselist=False)
    free_data: Mapped["EntryFreeData"] = relationship("EntryFreeData", back_populates="entry", uselist=False)

class EntryMoodData(db.Model):
    __tablename__ = 'entries_mood_data'
    
    id: Mapped[UUID] = mapped_column(ForeignKey('entries.id'), primary_key=True)
    selected_mood: Mapped[str] = mapped_column(nullable=False)
    user_response: Mapped[str] = mapped_column(nullable=False)

    entry: Mapped["Entry"] = relationship("Entry", back_populates="mood_data")

class EntryPromptData(db.Model):
    __tablename__ = 'entries_prompt_data'
    
    id: Mapped[UUID] = mapped_column(ForeignKey('entries.id'), primary_key=True)
    prompt_text: Mapped[str] = mapped_column(nullable=False)
    user_response: Mapped[str] = mapped_column(nullable=False)

    entry: Mapped["Entry"] = relationship("Entry", back_populates="prompt_data")

class EntryFreeData(db.Model):
    __tablename__ = 'entries_free_data'
    
    id: Mapped[UUID] = mapped_column(ForeignKey('entries.id'), primary_key=True)
    user_response: Mapped[str] = mapped_column(nullable=False)

    entry: Mapped["Entry"] = relationship("Entry", back_populates="free_data")

# ------------------- JOURNAL ENTRY DATA TABLES 
