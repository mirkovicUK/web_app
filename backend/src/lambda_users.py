import json
import boto3
import botocore
import time
from datetime import datetime as dt
from botocore.exceptions import ClientError

import base64
import hashlib
import hmac
import logging
from random import randint, sample

logger = logging.getLogger(__name__)



def lambda_handler(event, context):
    """
    Lambda to handle cognito idp
    """
    cognito_idp_client = boto3.client('cognito-idp')
    user_pool_id='eu-west-2_Zzl6pXO5x'
    client_id = '2ajliukud2ofqp5l4nu939srks'
    
    if (event['body']) and (event['body'] is not None) and (event['httpMethod'] == 'POST'):
        body = json.loads(event['body'])
        username = body.get('username')
        #chek if username is available on body
        if(username is not None):
            cognito_wrapper = CognitoIdentityProviderWrapper(
                cognito_idp_client=cognito_idp_client,
                user_pool_id=user_pool_id,
                client_id=client_id,
            )
            user = cognito_wrapper.get_user(user_name=username)
            if(user is not None):
                #build 50 available username options
                possible_usernames = [
                    username + str(randint(0, 99)) if i<25 
                    else username + str(randint(0, 999)) 
                    for i in range(50)
                    ]
                valid_usernames = [
                    x for x in possible_usernames
                    if cognito_wrapper.get_user(x) is None
                ]
                ret = headers()
                ret.update({
                    'statusCode': 401,
                    'body': json.dumps(sample(valid_usernames, k=5))
                })
                return ret
            else:
                #username is valid here .get_user() == None 
                ret =  headers()
                ret.update({
                    "statusCode": 200,
                    "body":json.dumps(f'{username} is valid')
                    })
                return ret

            


class CognitoIdentityProviderWrapper:
    """Encapsulates Amazon Cognito actions"""
    def __init__(self, cognito_idp_client, user_pool_id, client_id, client_secret=None):
        """
        :param cognito_idp_client: A Boto3 Amazon Cognito Identity Provider client.
        :param user_pool_id: The ID of an existing Amazon Cognito user pool.
        :param client_id: The ID of a client application registered with the user pool.
        :param client_secret: The client secret, if the client has a secret.
        """
        self.cognito_idp_client = cognito_idp_client 
        self.user_pool_id = user_pool_id
        self.client_id = client_id
        self.client_secret = client_secret
    
    def get_user(self, user_name):
        """
        :param user_name: The user name that identifies the user.
        :return: user metadata when user exists within cognito pool.
                Otherwise, None.
        """
        try:
            return self.cognito_idp_client.admin_get_user(
                    UserPoolId=self.user_pool_id, Username=user_name
                )
        except ClientError as err:
            if err.response["Error"]["Code"] == "UserNotFoundException":
                return None
            else:
                raise err
            
def headers():
    obj = {
        "headers": {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': 'https://staging.d2utmyzor4zcsw.amplifyapp.com',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
        },
    }
    return obj