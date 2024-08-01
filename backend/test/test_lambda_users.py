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



# @mock_aws
# def test_lambda_POST_new_user_return_200():
#     with open('backend/api_gateway_event.txt', 'r') as f:
#         event = json.loads(f.read())
    
#     body = json.dumps({"username":"new@user1.com",
#                "password":"pasword12345",
#                "first_name" : "Ur",
#                "last_name" : "Mr"})
#     http_method = 'POST'
#     event['body'], event['httpMethod'] = body, http_method

#     AttributeDefinitions=[
#         {
#             'AttributeName': 'username',
#             'AttributeType': 'S',
#         }
#     ]
#     KeySchema=[
#         {
#             'AttributeName': 'username',
#             'KeyType': 'HASH',
#         }
#     ]
#     BillingMode = 'PAY_PER_REQUEST'
#     TableName='users'

#     client = boto3.client('dynamodb')   
#     client.create_table(AttributeDefinitions=AttributeDefinitions,
#                         KeySchema = KeySchema,
#                         TableName=TableName,
#                         BillingMode=BillingMode)
#     response = lambda_handler(event, context=None)

#     dynamodb = boto3.resource('dynamodb')
#     dynamo_table = dynamodb.Table('users')
#     dynamo_table_response = dynamo_table.get_item(
#         Key={
#             'username':'new@user1.com'
#         }
#     )

#     assert dynamo_table_response['Item']['first_name'] == 'Ur'
#     assert response['statusCode'] == 200
#     assert json.loads(response['body']) == "User Ur Mr created"


# @mock_aws
# def test_lambda_POST_handle_DB_error_return_400():
#     with open('backend/api_gateway_event.txt', 'r') as f:
#         event = json.loads(f.read())
    
#     body = json.dumps({"username":"new@user1.com",
#                "password":"pasword12345",
#                "first_name" : "Ur",
#                "last_name" : "Mr"})
#     http_method = 'POST'
#     event['body'], event['httpMethod'] = body, http_method

#     AttributeDefinitions=[
#         {
#             'AttributeName': 'username',
#             'AttributeType': 'S',
#         }
#     ]
#     KeySchema=[
#         {
#             'AttributeName': 'username',
#             'KeyType': 'HASH',
#         }
#     ]
#     BillingMode = 'PAY_PER_REQUEST'
#     TableName='some_other_users_'

#     client = boto3.client('dynamodb')   
#     client.create_table(AttributeDefinitions=AttributeDefinitions,
#                         KeySchema = KeySchema,
#                         TableName=TableName,
#                         BillingMode=BillingMode)
#     response = lambda_handler(event, context=None)

#     assert json.loads(response['body']) == 'Database error'
#     assert response['statusCode'] == 400
    
# @mock_aws
# def test_lambda_fetch_user_and_return_200():
#     with open('backend/api_gateway_event.txt', 'r') as f:
#         event = json.loads(f.read())
    
#     body = json.dumps({"username":"new@user1.com",
#                "password":"pasword12345",
#                "first_name" : "Ur",
#                "last_name" : "Mr"})
#     http_method = 'POST'
#     event['body'], event['httpMethod'] = body, http_method

#     AttributeDefinitions=[
#         {
#             'AttributeName': 'username',
#             'AttributeType': 'S',
#         }
#     ]
#     KeySchema=[
#         {
#             'AttributeName': 'username',
#             'KeyType': 'HASH',
#         }
#     ]
#     BillingMode = 'PAY_PER_REQUEST'
#     TableName='users'

#     client = boto3.client('dynamodb')   
#     client.create_table(AttributeDefinitions=AttributeDefinitions,
#                         KeySchema = KeySchema,
#                         TableName=TableName,
#                         BillingMode=BillingMode)
#     lambda_handler(event, context=None)

#     body = json.dumps({"username":"new@user1.com"})
#     http_method = 'GET'
#     event['body'], event['httpMethod'] = body, http_method
#     response = lambda_handler(event, context=None)
#     properties = ('username', 'password', 'first_name', \
#                   'last_name', 'last_updated_time')
#     lambda_response_body = json.loads(response['body'])
#     assert lambda_response_body['username'] == 'new@user1.com'
#     for property in properties:
#         assert property in lambda_response_body

# @mock_aws
# def test_lambda_GETmethod_return_404_data_not_found():
#     with open('backend/api_gateway_event.txt', 'r') as f:
#         event = json.loads(f.read())

#     AttributeDefinitions=[
#         {
#             'AttributeName': 'username',
#             'AttributeType': 'S',
#         }
#     ]
#     KeySchema=[
#         {
#             'AttributeName': 'username',
#             'KeyType': 'HASH',
#         }
#     ]
#     BillingMode = 'PAY_PER_REQUEST'
#     TableName='users'

#     client = boto3.client('dynamodb')   
#     client.create_table(AttributeDefinitions=AttributeDefinitions,
#                         KeySchema = KeySchema,
#                         TableName=TableName,
#                         BillingMode=BillingMode)

#     body = json.dumps({"username":"new@user1.com"})
#     http_method = 'GET'
#     event['body'], event['httpMethod'] = body, http_method
#     response = lambda_handler(event, context=None)
#     assert response['statusCode'] == 404
#     assert json.loads(response['body']) == 'User does not exists'


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

