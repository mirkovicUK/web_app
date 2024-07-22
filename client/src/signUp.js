function showPassword(){
    const x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}



/////////////////////////////////////////////////////////////////////////////////////
//####### Cognito signUp #########################################################
///////////////////////////////////////////////////////////////////////////////////

import {
    SignUpCommand,
    CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

const signUp = ({clientId, username, password, email, region='eu-west-2'}) => {
    const client = new CognitoIdentityProviderClient({region});

    const command = new SignUpCommand({
      ClientId: clientId,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    });
  
    return client.send(command);
};  
const cognitoSignUpHandler = async (data)=>{
    data.clientId = window.CONFIG.clientId
    const response = await signUp(data)
    console.log(response)
    console.log(response['$metadata'].httpStatusCode === 200)
}

export { signUp };
