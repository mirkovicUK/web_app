
import { mockClient } from "aws-sdk-client-mock";
import { 
  SignUpCommand,
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  UserNotFoundException
} from "@aws-sdk/client-cognito-identity-provider";
import {
  signUp,
  cognitoSignUpHandler,
  getUser,
  findAwailableUsername,
} from "../src/signUp.js"


// const cognitoMock = mockClient(CognitoIdentityProviderClient)
// beforeEach(() => {
//   cognitoMock.reset();
// });

describe.skip('signUp()', () => {
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

describe.skip('getUser()', () => {
  it('getUser is mocked', async()=>{
    const cognitoResponse = 
    { // AdminGetUserResponse
      Username: "STRING_VALUE", // required
      UserAttributes: [ 
        { // AttributeType
          Name: "STRING_VALUE", // required
          Value: "STRING_VALUE",
        },
      ],
      UserCreateDate: new Date("TIMESTAMP"),
      UserLastModifiedDate: new Date("TIMESTAMP"),
      Enabled: true,
      UserStatus: "UNCONFIRMED",
      '$metadata': {
        httpStatusCode: 200,
      }
    };
    cognitoMock.on(AdminGetUserCommand).resolves(cognitoResponse)
    const input = {UserPoolId:'test', username:'test',}

    const response = await getUser(input)
    expect(response).toEqual(cognitoResponse)
  })
})

describe('findAwailableUsername()', ()=>{
  it.skip('function returns false if username is not available (response=200)', async()=>{
    const cognitoResponse = 
    { // AdminGetUserResponse
      Username: "STRING_VALUE", // required
      UserAttributes: [ 
        { // AttributeType
          Name: "STRING_VALUE", // required
          Value: "STRING_VALUE",
        },
      ],
      UserCreateDate: new Date("TIMESTAMP"),
      UserLastModifiedDate: new Date("TIMESTAMP"),
      Enabled: true,
      UserStatus: "UNCONFIRMED",
      '$metadata': {
        httpStatusCode: 200,
      }
    };
    cognitoMock.on(AdminGetUserCommand).resolves(cognitoResponse)
    const input = {UserPoolId:'test', username:'test'}
    expect(await findAwailableUsername(input)).toEqual(false)
  })

  it.skip('live test for true', async ()=>{
    const input = {
      UserPoolId: 'eu-west-2_Zzl6pXO5x',
      // username:'uros11'
    }
    expect(await findAwailableUsername(input)).toEqual(true)
  })
})
