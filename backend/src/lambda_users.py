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

logger = logging.getLogger(__name__)



def lambda_handler(event, context):
    """
    Lambda to check if user exist in cognito
    """
    cognito_idp_client = boto3.client('cognito-idp')
    user_pool_id='eu-west-2_Zzl6pXO5x'
    client_id = '2ajliukud2ofqp5l4nu939srks'
    
    if (event['body']) and (event['body'] is not None) and (event['httpMethod'] == 'POST'):
        body = json.loads(event['body'])
        username = body['username']

            


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
        returns user from Amazon Cognito
        :param user_name: The user name that identifies the user.
        :return: user metadata when user exists with cognito pool.
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