import pytest
import json  
from datetime import datetime
from dateutil.parser import parse

def test_add_user(test_client, user_payload):  
    response = test_client.post(  
        "/users", data=json.dumps(user_payload), content_type="application/json"  
    )  
    assert response.status_code == 201  
    create_response_json = json.loads(response.data)  
    assert create_response_json == {"message": "User created"}  
  
    response = test_client.get("/users")  
    assert response.status_code == 200  
  
    read_response_json = json.loads(response.data)  
    print(read_response_json)  

    assert read_response_json[0]["email"] == user_payload["email"]
    assert read_response_json[0]["name"] == user_payload["name"]

    validate_created_at(read_response_json[0])

# read all possible prompts
# read all possible moods 

# create 3 journal entries, 1 for each type. Read all 3, verify they are all correct.
# read all journal entries between separate dates

# HELPER FUNCTIONS

# validates that the created_at value is a valid datetime object that exists
def validate_created_at(response_json):
    try:
        parsed = parse(response_json["created_at"])
    except ValueError:
        pytest.fail("Invalid datetime format")
    except KeyError:
        pytest.fail("No created_at field")

    assert isinstance(parsed, datetime)