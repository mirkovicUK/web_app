import json
import boto3
import time
from datetime import datetime as dt


def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table('users')

    body = json.loads(event['body'])
    user_name = body['user_name']
    password = body ['password']
    

    users_table.put_item(Item={
        'user_name' : user_name,
        'password' : password,
        'last_updated_time' : dt.now().strftime("%d/%m/%Y, %H:%M:%S")
    })
