import json
import boto3
import botocore
import time
from datetime import datetime as dt

import botocore.exceptions


def lambda_handler(event, context):
    """
    Lambda to insert and fetch users to/from user table 
    """
    table_name = 'users'
    dynamodb_client = boto3.client('dynamodb')
    dynamodb_table = boto3.resource('dynamodb').Table(table_name)
    
    # POST new user
    try:
        if (event['body']) and (event['body'] is not None) and (event['httpMethod'] == 'POST'):
            body = json.loads(event['body'])

            response = dynamodb_client.put_item(
            TableName = table_name,
            Item={
            'username' : {'S': body['username']},
            'password' : {'S': body['password']},
            'first_name': {'S': body['first_name']},
            'last_name': {'S': body['last_name']},
            'last_updated_time' : {'S' : dt.now().strftime("%d/%m/%Y, %H:%M:%S")}})
            if response['ResponseMetadata']['HTTPStatusCode'] == 200:
                return {"statusCode": 200,
                        "headers": {
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': 'https://staging.d2utmyzor4zcsw.amplifyapp.com',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'},
                        "body": json.dumps('User ' + body['first_name'] \
                                           + ' ' + body['last_name'] + ' created'),
                        "isBase64Encoded": False
                        }
    except KeyError as e:
        return {
                "statusCode": 400,
                "headers": {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': 'https://staging.d2utmyzor4zcsw.amplifyapp.com',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
                    },
                "body": json.dumps('Unable to create new user'),
                "isBase64Encoded": False
                }
    except botocore.exceptions.ClientError as e:
        return {
                "statusCode": 400,
                "headers": {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': 'https://staging.d2utmyzor4zcsw.amplifyapp.com',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
                    },
                "body": json.dumps('Database error'),
                "isBase64Encoded": False
                } 
    
    # fetch user
    try:
        if (event['body']) and (event['body'] is not None) and \
                                            (event['httpMethod'] == 'GET'):
            body = json.loads(event['body'])
            dynamodb_table_response = dynamodb_table.get_item(Key=body)
            body = dynamodb_table_response['Item']
            return {"statusCode": 200,
                        "headers": {
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': 'https://staging.d2utmyzor4zcsw.amplifyapp.com',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'},
                        "body": json.dumps(body),
                        "isBase64Encoded": False
                        }
    except KeyError as e:
        return {
                "statusCode": 404,
                "headers": {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': 'https://staging.d2utmyzor4zcsw.amplifyapp.com',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
                    },
                "body": json.dumps('User does not exists'),
                "isBase64Encoded": False
                }
    except botocore.exceptions.ClientError as e:
        return {
                "statusCode": 400,
                "headers": {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': 'https://staging.d2utmyzor4zcsw.amplifyapp.com',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
                    },
                "body": json.dumps('Database error'),
                "isBase64Encoded": False
                }


