/*
This file contains tests for cognitoSignUpHandler()
Any time function is changed it has be imported here manualy
*/

import {
    UsernameExistsException,
    InvalidPasswordException,
    InvalidParameterException
} from "@aws-sdk/client-cognito-identity-provider"

import {
    signUp,
} from "../src/signUp/signUp.js"

const window={}
window.CONFIG = {
    clientId: 'test', 
    region: 'test',
    UserPoolId: 'test'
}

import {expect, jest, test} from '@jest/globals';

jest.unstable_mockModule('node:child_process', () => ({
    successfulSignUp: jest.fn(()=>'successfulSignUp --> mocked'),
    usernameExistsExceptionHandler:jest.fn(()=>'usernameExistsExceptionHandler --> mocked'),
    invalidPasswordExceptionHandler:jest.fn(()=>'invalidPasswordExceptionHandler --> mocked'),
    invalidParameterExceptionHandler: jest.fn(()=>'invalidParameterExceptionHandler --> mocked')
}));
const {
    successfulSignUp,
    usernameExistsExceptionHandler,
    invalidPasswordExceptionHandler,
    invalidParameterExceptionHandler
} = await import('node:child_process');

//reset jest mocks 
afterEach(() => {
    jest.resetAllMocks();
    successfulSignUp.mockImplementation(() => 'successfulSignUp --> mocked');
});

test('all imports are mocked', () => {
    expect(successfulSignUp()).toBe('successfulSignUp --> mocked');
    expect(usernameExistsExceptionHandler()).toBe('usernameExistsExceptionHandler --> mocked')
    expect(invalidPasswordExceptionHandler()).toBe('invalidPasswordExceptionHandler --> mocked')
    expect(invalidParameterExceptionHandler()).toBe('invalidParameterExceptionHandler --> mocked')
});

import { 
    SignUpCommand,
    CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

import  {mockClient}  from "aws-sdk-client-mock";
const cognitoMock = mockClient(CognitoIdentityProviderClient)
beforeEach(() => {
  cognitoMock.reset();
});

test('cognitoSignUpHandler calls successfulSignUp on receiving code:200', async()=>{
    cognitoMock.on(SignUpCommand)
    .resolves({'$metadata':{httpStatusCode : 200}})
    const input = {
        username:'test',
        password:'test',
        email:'test'
    }
    await cognitoSignUpHandler(input)
    expect(successfulSignUp).toHaveBeenCalled()
})

test(`cognitoSignUpHandler calls usernameExistsExceptionHandler 
    on receiving UsernameExistsException from Cognito`, async()=>{
    cognitoMock.on(SignUpCommand)
    .rejects(new UsernameExistsException())
    const input = {
        username:'test',
        password:'test',
        email:'test'
    }
    await cognitoSignUpHandler(input)
    expect(usernameExistsExceptionHandler).toHaveBeenCalled()
})

test(`cognitoSignUpHandler calls invalidPasswordExceptionHandler 
    on receiving InvalidPasswordException from Cognito`, async()=>{
    cognitoMock.on(SignUpCommand)
    .rejects(new InvalidPasswordException())
    const input = {
        username:'test',
        password:'test',
        email:'test'
    }
    await cognitoSignUpHandler(input)
    expect(invalidPasswordExceptionHandler).toHaveBeenCalled()
})

test(`cognitoSignUpHandler calls InvalidParameterException 
    on receiving invalidParameterExceptionHandler from Cognito`, async()=>{
    cognitoMock.on(SignUpCommand)
    .rejects(new InvalidParameterException())
    const input = {
        username:'test',
        password:'test',
        email:'test'
    }
    await cognitoSignUpHandler(input)
    expect(invalidParameterExceptionHandler).toHaveBeenCalled()
})
 
///////////////////////////////////////////////////////
//copyAfterThisLine
async function cognitoSignUpHandler (data){
    data.clientId = window.CONFIG.clientId
    data.UserPoolId = window.CONFIG.UserPoolId
    data.region = window.CONFIG.region
    try {
        const response = await signUp(data)
        if(response['$metadata'].httpStatusCode === 200){
            successfulSignUp()
        }
    } catch (error) {
        if(error instanceof UsernameExistsException){
           usernameExistsExceptionHandler(data)
        }else if (error instanceof InvalidPasswordException){
            invalidPasswordExceptionHandler(error.message)
        }else if (error instanceof InvalidParameterException){
            invalidParameterExceptionHandler(error.message)   
        }else{
            console.log('from cognitoSignUpHandler() uncought error')
            console.log(error.message)
            throw error
        }
    }
}