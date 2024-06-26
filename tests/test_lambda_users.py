from backend.lambda_users import lambda_handler

from moto import mock_aws

import boto3
import pytest
import os
import json



@mock_aws
def test_lambda():
    with open('backend/api_gateway_event.txt', 'r') as f:
        event = json.loads(f.read())
    
    body = '{"user_name":"new_user1","password":"pasword12345"}'
    http_method = 'POST'
    event['body'], event['httpMethod'] = body, http_method

    AttributeDefinitions=[
        {
            'AttributeName': 'user_name',
            'AttributeType': 'S',
        },
        {
            'AttributeName': 'password',
            'AttributeType': 'S',
        },
    ]
    KeySchema=[
        {
            'AttributeName': 'user_name',
            'KeyType': 'HASH',
        },
        {
            'AttributeName': 'password',
            'KeyType': 'HASH',
        },
    ]
    ProvisionedThroughput={
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5,
    }
    TableName='users'

    client = boto3.client('dynamodb')   
    client.create_table(AttributeDefinitions=AttributeDefinitions,
                        KeySchema = KeySchema,
                        ProvisionedThroughput = ProvisionedThroughput,
                        TableName=TableName)
    
    response = lambda_handler(event, context=None)

    response = client.get_item(
                Key={
                    'user_name': {
                        'S': 'new_user1',
                    },
                },
                TableName='Music',
                )

    print(response)

    



