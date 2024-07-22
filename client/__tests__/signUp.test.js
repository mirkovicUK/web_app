import { mockClient } from "aws-sdk-client-mock";
import { 
  SignUpCommand,
  CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider";
import { signUp } from "../src/signUp.js"



const cognitoMock = mockClient(CognitoIdentityProviderClient)
beforeEach(() => {
  cognitoMock.reset();
});

describe('signUp()', () => {
  it('signeUp is mocked', async () => {

    const cognitoResponse = {
      UserConfirmed: false, // required
      CodeDeliveryDetails: { // CodeDeliveryDetailsType
        Destination: "STRING_VALUE",
        DeliveryMedium: "EMAIL",
        AttributeName: "email",
      },
      UserSub: "123456", // required
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
    const result = await signUp(input)
    expect(result).toBe(cognitoResponse)
  })

})

