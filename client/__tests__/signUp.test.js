import {expect, jest, test} from '@jest/globals';

import 'aws-sdk-client-mock-jest';
import  {mockClient}  from "aws-sdk-client-mock";
import { 
  SignUpCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

import {
  signUp,
} from "../src/signUp/signUp.js"


const cognitoMock = mockClient(CognitoIdentityProviderClient)
beforeEach(() => {
  cognitoMock.reset();
});

describe('signUp()', () => {
  it('signUp is mocked', async () => {
    
    const cognitoResponse = {
      UserConfirmed: false, 
      CodeDeliveryDetails: { 
        Destination: "STRING_VALUE",
        DeliveryMedium: "EMAIL",
        AttributeName: "email",
      },
      UserSub: "123456",
      $metadata:{
        httpStatusCode : 200}
      }
    cognitoMock.on(SignUpCommand).resolves(cognitoResponse)

    const input = {
      clientId:'test',
      username:'test',
      password:'test',
      email:'test'
    }
    const result =  await signUp(input)
    expect(result).toEqual(cognitoResponse)
  })
  
  it('signUp doesnot mutate input', async()=>{
    const cognitoResponse = {}
    cognitoMock.on(SignUpCommand).resolves(cognitoResponse)

    const input = {
      clientId:'test',
      username:'test',
      password:'test',
      email:'test'
    }
    const result =  await signUp(input)
    expect(input).toEqual({
      clientId:'test',
      username:'test',
      password:'test',
      email:'test'
    })
  })
})


describe.skip('cognitoSignUpHandler()', ()=>{
  it('function calls to succesfulSignUp() after receiving 200', async()=>{
    // cognitoMock.on(SignUpCommand).resolves({'$metadata':{httpStatusCode:200}})
    // const invalidPasswordException = new InvalidPasswordException();
    cognitoMock.on(SignUpCommand)
    .resolves({'$metadata':{httpStatusCode : 200}})

    const input = {
      username:'test',
      password:'test',
      email:'test'
    }
    jest.unstable_mockModule('node:child_process', () => ({
      successfulSignUp: jest.fn(() => 'mocked')
  }));
    // const {successfulSignUp} = await import('node:child_process');
  
    
    

    cognitoSignUpHandler(input)
    expect(successfulSignUp).toHaveBeenCalled()
    // expect(cognitoMock).toHaveReceivedCommand(SignUpCommand)
    // expect(cognitoSignUpHandler(input)).toBe('mocked')
  })
})


