import pytest
import json
from datetime import datetime, timedelta
from dateutil.parser import parse
from unittest.mock import patch

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


@pytest.fixture
def mock_auth():
    def mock_verify_id_token(id_token):
        if id_token == 'john_token':
            return {
                "uid": "john's uid",
                "email": "john@gmail.com"
            }
        elif id_token == 'alice_token':
            return {
                "uid": "alice's uid",
                "email": "alice@gmail.com"
            }
        else:
            raise ValueError("Invalid token")
    with patch("firebase_admin.auth.verify_id_token", side_effect=mock_verify_id_token):
        yield


@pytest.fixture
def john_id_token(test_client, mock_auth):
    # ensure that john is in the users table
    response = test_client.get(
        '/user', headers={f'Authorization': 'Bearer john_token'})
    assert response.status_code == 200

    return 'john_token'


@pytest.fixture
def alice_id_token(test_client, mock_auth):
    # ensure that john is in the users table
    response = test_client.get(
        '/user', headers={f'Authorization': 'Bearer alice_token'})
    assert response.status_code == 200

    return 'alice_token'


def test_get_user_authorized(test_client, mock_auth):
    for _ in range(2):
        response = test_client.get(
            '/user', headers={f'Authorization': 'Bearer john_token'})
        assert response.status_code == 200

        response_json = json.loads(response.data)
        assert response_json['email'] == 'john@gmail.com'

        validate_datetime(response_json, 'createdAt')


def test_get_user_unauthorized(test_client, mock_auth):
    response = test_client.get('/user', headers={
        'Authorization': 'Bearer invalid_token'
    })
    assert response.status_code == 401


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


def add_entries(test_client, entries, id_token):
    create_response = test_client.post(
        '/entries',
        data=json.dumps(entries),
        content_type='application/json',
        headers={'Authorization': f'Bearer {id_token}'}
    )
    return create_response


def get_entries(test_client, start_date, end_date, id_token):
    get_response = test_client.get(
        f'/entries?start={start_date}&end={end_date}',
        headers={'Authorization': f'Bearer {id_token}'}
    )
    return get_response


def test_add_then_get_entries(test_client, create_valid_entries, john_id_token):
    # TEST CREATING AND POSTING ENTRIES
    ((start_date, end_date), entries) = create_valid_entries

    create_response = add_entries(test_client, entries, john_id_token)
    assert create_response.status_code == 201

    create_response_json = json.loads(create_response.data)

    assert create_response_json['message'] == 'All entries successfully added'

    # TEST GETTING ENTRIES

    get_response = get_entries(
        test_client, start_date, end_date, john_id_token)
    assert get_response.status_code == 200
    get_response_json = json.loads(get_response.data)

    # sort entries so that they are ordered the same

    def sort_by_created_at_and_type(entry):
        return (entry['createdAt'], entry['type'], entry['data']['userResponse'])

    sorted_response_entries = sorted(
        get_response_json['entries'], key=sort_by_created_at_and_type)
    sorted_expected_entries = sorted(entries, key=sort_by_created_at_and_type)

    assert sorted_response_entries == sorted_expected_entries


def test_get_entries_two_users(test_client, create_valid_entries, john_id_token, alice_id_token):
    ((start_date, end_date), entries) = create_valid_entries

    # create two unique sets of entries
    n = len(entries)
    entries_john = entries[0:n//2]
    entries_alice = entries[n//2:n-1]

    # create entries for both john and alice
    create_res_john = add_entries(test_client, entries_john, john_id_token)
    create_res_alice = add_entries(test_client, entries_alice, alice_id_token)
    assert create_res_john.status_code == 201
    assert create_res_alice.status_code == 201

    # get entries for john
    get_res_john = get_entries(
        test_client, start_date, end_date, john_id_token)
    get_res_john_json = json.loads(get_res_john.data)

    # get entries for alice
    get_res_alice = get_entries(
        test_client, start_date, end_date, alice_id_token)
    get_res_alice_json = json.loads(get_res_alice.data)

    # sort all entries across all list
    def sort_entries(entry):
        return (entry['createdAt'], entry['type'], entry['data']['userResponse'])

    entries_john_expected = sorted(entries_john, key=sort_entries)
    entries_alice_expected = sorted(entries_alice, key=sort_entries)
    entries_john_actual = sorted(
        get_res_john_json['entries'], key=sort_entries)
    entries_alice_actual = sorted(
        get_res_alice_json['entries'], key=sort_entries)

    # check entries for john and alice are as expected
    assert entries_john_expected == entries_john_actual
    assert entries_alice_expected == entries_alice_actual

 
@pytest.mark.parametrize(
    'days',
    [0, 1, 32, 366]
)
def test_update_streak(test_client, john_id_token, days):
    today = datetime.now()
    for i in range(days):
        cur_date_str = str(today + timedelta(i))
        patch_req_body = { 'lastStreakDate': cur_date_str }
        
        patch_response = test_client.patch(
            'streak',
            data=json.dumps(patch_req_body),
            content_type='application/json',
            headers={'Authorization': f'Bearer {john_id_token}'}
        )
        assert patch_response.status_code == 201
        patch_response_data = json.loads(patch_response.data)
        assert patch_response_data['new_streak'] == i+1


    get_streak_res = test_client.get(
        '/streak',
        headers={'Authorization': f'Bearer {john_id_token}'}
    )  

    assert get_streak_res.status_code == 200
    streak_json = json.loads(get_streak_res.data)
    assert streak_json['streak'] == days

# test missing a daily reflection results in resetting the streak
def test_miss_daily(test_client, john_id_token):
    # create 5 day streak
    today = datetime.now()
    for i in range(5):
        cur_date_str = str(today + timedelta(i))
        patch_req_body = { 'lastStreakDate': cur_date_str }
        
        patch_response = test_client.patch(
            'streak',
            data=json.dumps(patch_req_body),
            content_type='application/json',
            headers={'Authorization': f'Bearer {john_id_token}'}
        )
        assert patch_response.status_code == 201
        patch_response_data = json.loads(patch_response.data)
        assert patch_response_data['new_streak'] == i+1

    
    get_streak_res = test_client.get('/streak', headers={'Authorization': f'Bearer {john_id_token}'})  
    assert get_streak_res.status_code == 200
    streak_json = json.loads(get_streak_res.data)
    assert streak_json['streak'] == 5

    # skip 1 day and check that streak resets to 1 when completing daily
    cur_date_str = str(today + timedelta(7))
    patch_req_body = { 'lastStreakDate': cur_date_str }
    patch_response = test_client.patch(
        'streak',
        data=json.dumps(patch_req_body),
        content_type='application/json',
        headers={'Authorization': f'Bearer {john_id_token}'}
    )
    assert patch_response.status_code == 201
    patch_response_data = json.loads(patch_response.data)
    assert patch_response_data['new_streak'] == 1