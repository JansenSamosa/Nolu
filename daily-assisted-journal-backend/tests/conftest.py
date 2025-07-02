import sys
# sys.path.insert(0, '/home/jansensamosa/Documents/Projects/daily-assisted-journal/daily-assisted-journal-backend')


import pytest
import random
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError as SQLAlchemyOperationalError
from sqlalchemy.pool import StaticPool
from app.app import create_app, seed_initial_data, journal_prompts, moods
from app.app import db


def pytest_addoption(parser):
    parser.addoption(
        "--dburl",  # For Postgres use "postgresql://user:password@localhost/dbname"
        action="store",
        default="sqlite:///:memory:",  # Default uses SQLite in-memory database
        help="Database URL to use for tests.",
    )


@pytest.fixture(scope="function")
def db_url(request):
    """Fixture to retrieve the database URL."""
    return request.config.getoption("--dburl")


@pytest.hookimpl(tryfirst=True)
def pytest_sessionstart(session):
    db_url = session.config.getoption("--dburl")
    try:
        # Attempt to create an engine and connect to the database.
        engine = create_engine(
            db_url,
            poolclass=StaticPool,
        )
        connection = engine.connect()
        connection.close()  # Close the connection right after a successful connect.
        print("Using Database URL:", db_url)
        print("Database connection successful.....")
    except SQLAlchemyOperationalError as e:
        print(f"Failed to connect to the database at {db_url}: {e}")
        pytest.exit(
            "Stopping tests because database connection could not be established."
        )


@pytest.fixture(scope="function")
def app(db_url):
    """Session-wide test 'app' fixture."""
    test_config = {
        "SQLALCHEMY_DATABASE_URI": db_url,
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    }
    app = create_app(test_config)

    with app.app_context():
        db.create_all()
        seed_initial_data(db)

        yield app

        # Close the database session and drop all tables after the session
        db.session.remove()
        db.drop_all()


@pytest.fixture
def test_client(app):
    """Test client for the app."""
    return app.test_client()


@pytest.fixture
def user_payload():
    suffix = random.randint(1, 100)
    return {
        "name": f"JohnDoe_{suffix}",
        "email": f"john_{suffix}@doe.com",
    }

@pytest.fixture
def all_moods():
    return moods

@pytest.fixture
def all_prompts():
    return journal_prompts
