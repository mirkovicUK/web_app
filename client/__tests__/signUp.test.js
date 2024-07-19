import { signUp } from "../src/signUp"
import { mockClient } from "aws-sdk-client-mock";
import { 
  SignUpCommand,
  CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider";

describe('proba', () => {
  it('tests are linked', () => {
    expect(proba()).toBe(true)
  })
})

describe('proba1', () => {  
    it('this is second it', ()=>{
      expect(true).toBe(true)
    })
  })