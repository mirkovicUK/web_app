from backend.lambda_users import lambda_handler

from moto import mock_aws

import boto3
import pytest
import os
import json



@mock_aws
def test_lambda_POST_new_user_return_200():
    with open('backend/api_gateway_event.txt', 'r') as f:
        event = json.loads(f.read())
    
    body = json.dumps({"username":"new@user1.com",
               "password":"pasword12345",
               "first_name" : "Ur",
               "last_name" : "Mr"})
    http_method = 'POST'
    event['body'], event['httpMethod'] = body, http_method

    AttributeDefinitions=[
        {
            'AttributeName': 'username',
            'AttributeType': 'S',
        }
    ]
    KeySchema=[
        {
            'AttributeName': 'username',
            'KeyType': 'HASH',
        }
    ]
    BillingMode = 'PAY_PER_REQUEST'
    TableName='users'

    client = boto3.client('dynamodb')   
    client.create_table(AttributeDefinitions=AttributeDefinitions,
                        KeySchema = KeySchema,
                        TableName=TableName,
                        BillingMode=BillingMode)
    response = lambda_handler(event, context=None)

    dynamodb = boto3.resource('dynamodb')
    dynamo_table = dynamodb.Table('users')
    dynamo_table_response = dynamo_table.get_item(
        Key={
            'username':'new@user1.com'
        }
    )

    assert dynamo_table_response['Item']['first_name'] == 'Ur'
    assert response['statusCode'] == 200
    assert json.loads(response['body']) == "User Ur Mr created"


@mock_aws
def test_lambda_POST_handle_DB_error_return_400():
    with open('backend/api_gateway_event.txt', 'r') as f:
        event = json.loads(f.read())
    
    body = json.dumps({"username":"new@user1.com",
               "password":"pasword12345",
               "first_name" : "Ur",
               "last_name" : "Mr"})
    http_method = 'POST'
    event['body'], event['httpMethod'] = body, http_method

    AttributeDefinitions=[
        {
            'AttributeName': 'username',
            'AttributeType': 'S',
        }
    ]
    KeySchema=[
        {
            'AttributeName': 'username',
            'KeyType': 'HASH',
        }
    ]
    BillingMode = 'PAY_PER_REQUEST'
    TableName='some_other_users_'

    client = boto3.client('dynamodb')   
    client.create_table(AttributeDefinitions=AttributeDefinitions,
                        KeySchema = KeySchema,
                        TableName=TableName,
                        BillingMode=BillingMode)
    response = lambda_handler(event, context=None)

    assert json.loads(response['body']) == 'Database error'
    assert response['statusCode'] == 400
    
@mock_aws
def test_lambda_fetch_user_and_return_200():
    with open('backend/api_gateway_event.txt', 'r') as f:
        event = json.loads(f.read())
    
    body = json.dumps({"username":"new@user1.com",
               "password":"pasword12345",
               "first_name" : "Ur",
               "last_name" : "Mr"})
    http_method = 'POST'
    event['body'], event['httpMethod'] = body, http_method

    AttributeDefinitions=[
        {
            'AttributeName': 'username',
            'AttributeType': 'S',
        }
    ]
    KeySchema=[
        {
            'AttributeName': 'username',
            'KeyType': 'HASH',
        }
    ]
    BillingMode = 'PAY_PER_REQUEST'
    TableName='users'

    client = boto3.client('dynamodb')   
    client.create_table(AttributeDefinitions=AttributeDefinitions,
                        KeySchema = KeySchema,
                        TableName=TableName,
                        BillingMode=BillingMode)
    lambda_handler(event, context=None)

    body = json.dumps({"username":"new@user1.com"})
    http_method = 'GET'
    event['body'], event['httpMethod'] = body, http_method
    response = lambda_handler(event, context=None)
    properties = ('username', 'password', 'first_name', \
                  'last_name', 'last_updated_time')
    lambda_response_body = json.loads(response['body'])
    assert lambda_response_body['username'] == 'new@user1.com'
    for property in properties:
        assert property in lambda_response_body

@mock_aws
def test_lambda_GETmethod_return_404_data_not_found():
    with open('backend/api_gateway_event.txt', 'r') as f:
        event = json.loads(f.read())

    AttributeDefinitions=[
        {
            'AttributeName': 'username',
            'AttributeType': 'S',
        }
    ]
    KeySchema=[
        {
            'AttributeName': 'username',
            'KeyType': 'HASH',
        }
    ]
    BillingMode = 'PAY_PER_REQUEST'
    TableName='users'

    client = boto3.client('dynamodb')   
    client.create_table(AttributeDefinitions=AttributeDefinitions,
                        KeySchema = KeySchema,
                        TableName=TableName,
                        BillingMode=BillingMode)

    body = json.dumps({"username":"new@user1.com"})
    http_method = 'GET'
    event['body'], event['httpMethod'] = body, http_method
    response = lambda_handler(event, context=None)
    assert response['statusCode'] == 404
    assert json.loads(response['body']) == 'User does not exists'

@mock_aws
def test_lambda_GETmethod_handle_DB_error_return_400():
    with open('backend/api_gateway_event.txt', 'r') as f:
        event = json.loads(f.read())

    AttributeDefinitions=[
        {
            'AttributeName': 'username',
            'AttributeType': 'S',
        }
    ]
    KeySchema=[
        {
            'AttributeName': 'username',
            'KeyType': 'HASH',
        }
    ]
    BillingMode = 'PAY_PER_REQUEST'
    TableName='some users'

    client = boto3.client('dynamodb')   
    client.create_table(AttributeDefinitions=AttributeDefinitions,
                        KeySchema = KeySchema,
                        TableName=TableName,
                        BillingMode=BillingMode)

    body = json.dumps({"username":"new@user1.com"})
    http_method = 'GET'
    event['body'], event['httpMethod'] = body, http_method
    response = lambda_handler(event, context=None)
    assert response['statusCode'] == 400
    assert json.loads(response['body']) == 'Database error'