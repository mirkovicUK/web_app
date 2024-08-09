from backend.src import lambda_users
from backend.src.lambda_users import lambda_handler, CognitoIdentityProviderWrapper

from moto import mock_aws

from datetime import datetime
from unittest.mock import MagicMock, patch
import boto3
from botocore.exceptions import ClientError
from botocore.stub import ANY, Stubber
import pytest

import os
import json

@pytest.mark.describe('CognitoIdentityProviderWrapper.get_user()')
def test_get_user_return_user_when_exist():    
    cognito_idp_client = boto3.client("cognito-idp")

    stubber = Stubber(cognito_idp_client)
    response = {'Username':'user'}
    stubber.add_response('admin_get_user', response)

    user_pool_id = "test-user-pool-id"
    client_id = "test-client-id"
    user_name = "test-user_name"

    stubber.activate()
    wrapper = CognitoIdentityProviderWrapper(
        cognito_idp_client,
        user_pool_id,
        client_id
    )
    user = wrapper.get_user(user_name)
    stubber.deactivate()
    assert user == response

@pytest.mark.describe('CognitoIdentityProviderWrapper.get_user()')
def test_get_user_raise_UserNotFoundExeption():
    cognito_idp_client = boto3.client("cognito-idp")
    user_pool_id = "test-user-pool-id"
    client_id = "test-client-id"
    user_name = "test-user_name"
    with Stubber(cognito_idp_client) as stubbler:
        stubbler.add_client_error('admin_get_user', 'UserNotFoundException')
        wrapper = CognitoIdentityProviderWrapper(
            cognito_idp_client,
            user_pool_id,
            client_id
        )
        user = wrapper.get_user(user_name)
    assert user is None


@pytest.mark.describe('lambda_handler()')
def test_lambda_returns_200_when_username_available():
    # set up event from API GAteway to lambda
    with open('backend/api_gateway_event.txt', 'r') as f:
        event = json.loads(f.read())
    body = json.dumps({"username":"TEST"})
    http_method = 'POST'
    event['body'], event['httpMethod'] = body, http_method
    with patch.object(CognitoIdentityProviderWrapper, 'get_user', return_value=None) as mock_method:
        respond = lambda_handler(event, None)
    assert respond['statusCode'] == 200
    assert 'TEST' in json.loads(respond['body'])

@patch.object(CognitoIdentityProviderWrapper,
              'get_user',
                side_effect=[
                    {"username":"TEST"} if i==0
                    else None for i in range(51)
                ]
            )
@pytest.mark.describe('lambda_handler()')
def test_lambda_returns_401_and_list_of_available_usernames(get_user_patched):
    # set up event from API GAteway to lambda
    with open('backend/api_gateway_event.txt', 'r') as f:
        event = json.loads(f.read())
    user_metadata = {"username":"TEST"}
    body = json.dumps(user_metadata)
    http_method = 'POST'
    event['body'], event['httpMethod'] = body, http_method
    respond = lambda_handler(event, None)
    assert respond['statusCode'] == 401
    assert len(json.loads(respond['body'])) == 5

@pytest.mark.describe('CognitoIdentityProviderWrapper.list_users()')
def test_lists_user_return_users_when_exist():
    cognito_idp_client = boto3.client('cognito-idp')
    user_pool_id = "test-user-pool-id"
    client_id = "test-client-id"
    response = {
        'Users' :[{'Username':'user1'},{'Username':'user2'}]
    }
    with Stubber(cognito_idp_client) as stubbler:
        stubbler.add_response('list_users', response)
        wrapper = CognitoIdentityProviderWrapper(
            cognito_idp_client,
            user_pool_id,
            client_id
        )
        users = wrapper.list_users()
        assert users is response['Users']
        assert users == response['Users']

@pytest.mark.describe('CognitoIdentityProviderWrapper.list_users()')
def test_list_users_return_None_when_ResourceNotFoundException():
    cognito_idp_client = boto3.client('cognito-idp')
    user_pool_id = "test-user-pool-id"
    client_id = "test-client-id"
    with Stubber(cognito_idp_client) as stubbler:
        stubbler.add_client_error('list_users', 'ResourceNotFoundException')
        wrapper = CognitoIdentityProviderWrapper(
            cognito_idp_client,
            user_pool_id,
            client_id
        )
        users = wrapper.list_users({'email': 'YO email'})
        assert users is None

@pytest.mark.describe('lambda_handler()')
def test_lambda_returns_200_when_email_available():
    # set up event from API GAteway to lambda
    with open('backend/api_gateway_event.txt', 'r') as f:
        event = json.loads(f.read())
    body = json.dumps({"email":"TEST@TEST.com"})
    http_method = 'POST'
    event['body'], event['httpMethod'] = body, http_method
    with patch.object(CognitoIdentityProviderWrapper, 'list_users', return_value=None):
        respond = lambda_handler(event, None)
    assert respond['statusCode'] == 200
    assert 'TEST' in json.loads(respond['body'])