import os
import pytest
from dotenv import load_dotenv
from project import create_app
from utils import create_timestamp
from project.models import  User

load_dotenv()

@pytest.fixture(scope='module')
def new_user():
    user = User("1234","picture_url", 'kalle@gmail.com', "google", "12345", "access_token", create_timestamp())
    
    return user


@pytest.fixture(scope='module')
def test_client():
    os.environ['CONFIG_TYPE'] = 'config.TestingConfig'
    flask_app = create_app()

    with flask_app.test_client() as testing_client:
      
        with flask_app.app_context():
            yield testing_client