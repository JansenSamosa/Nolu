import pytest
import json
from datetime import datetime, timedelta
from dateutil.parser import parse

# HELPER FUNCTIONS

# validates that the a date time field exists and is valid


def validate_datetime(response_json, fieldName):
    try:
        parsed = parse(response_json[fieldName])
    except ValueError:
        pytest.fail("Invalid datetime format")
    except KeyError:
        pytest.fail(fieldName + " not found")

    assert isinstance(parsed, datetime)

# TEST CASES


def test_add_user(test_client, user_payload):
    response = test_client.post(
        "/users", data=json.dumps(user_payload), content_type="application/json"
    )
    assert response.status_code == 201
    create_response_json = json.loads(response.data)
    assert "id" in create_response_json

    id = create_response_json['id']

    response = test_client.get(f'/users/{id}')

    response_json = json.loads(response.data)
    assert response.status_code == 200
    # print(response_json)

    assert response_json["email"] == user_payload["email"]
    assert response_json["name"] == user_payload["name"]
    validate_datetime(response_json, 'createdAt')

    response_streak = test_client.get(f'/users/{id}/streak')
    assert response_streak.status_code == 200

    response_streak_json = json.loads(response_streak.data)
    # print(response_streak_json)

    assert response_streak_json["streak"] == 0
    assert response_streak_json["highestStreak"] == 0
    validate_datetime(response_streak_json, 'lastStreakDate')


def test_get_moods(test_client, all_moods):
    response = test_client.get('/moods')
    assert response.status_code == 200

    response_json = json.loads(response.data)
    # print(response_json)

    assert response_json['moods'] == all_moods


def test_get_prompts(test_client, all_prompts):
    response = test_client.get('/prompts')
    assert response.status_code == 200

    response_json = json.loads(response.data)
    # print(response_json)

    assert response_json['prompts'] == all_prompts

# param = (startDate, endDate)


@pytest.fixture(params=[
    ('2025-06-01', '2025-06-01'),
    ('2025-01-01', '2025-12-31'),
    ('2024-12-30', '2025-01-02'),
])
def create_valid_entries(request):
    cur_date = parse(request.param[0])
    end_date = parse(request.param[1])

    # create 3-4 dummy entries per day in the range.

    entries = []
    while cur_date <= end_date:
        cur_date_str = str(cur_date)

        entries.extend([{
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
        }])

        cur_date = cur_date + timedelta(days=1)

    return (request.param, entries)


def test_create_get_entries(test_client, create_valid_entries):
    # TEST CREATING AND POSTING ENTRIES
    ((start_date, end_date), entries) = create_valid_entries

    create_response = test_client.post(
        '/entries', data=json.dumps(entries), content_type='application/json'
    )
    assert create_response.status_code == 201
    
    create_response_json = json.loads(create_response)
    assert create_response_json['entriesAddedNum'] == len(entries)

    # TEST GETTING ENTRIES

    get_response = test_client.get(f'/entries?start={start_date}&end={end_date}')
    assert get_response.status_code == 200

    get_response_json = json.loads(get_response)
    
    def sort_by_created_at(entry):
        return entry['createdAt']

    sorted_response_entries = sorted(get_response_json['entries'], key=sort_by_created_at)
    sorted_expected_entries = sorted(entries, key=sort_by_created_at)
    assert sorted_response_entries == sorted_expected_entries

    assert False
