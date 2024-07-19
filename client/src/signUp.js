window.CONFIG = {
    clientId: '2ajliukud2ofqp5l4nu939srks', //cognito app client id
    region: 'eu-west-2'
}


function showPassword(){
    const x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
document.querySelector('input[type=checkbox]').
addEventListener('change', ()=>{
    showPassword()
})

/////////////////////////////////////////////////////////////////////////////////////
//####### Cognito signUp #########################################################
///////////////////////////////////////////////////////////////////////////////////

import {
    SignUpCommand,
    CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

// on submit form build JS obj and send it to cognitoSignUpHandler
document.querySelector('#signUpForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    const formDataObj = Object.fromEntries(new FormData(e.target))
    cognitoSignUpHandler(formDataObj)
})

const signUp = ({clientId, username, password, email, region='eu-west-2'}) => {
    const client = new CognitoIdentityProviderClient({region});
    
    console.log(clientId, username, password, email)

    const command = new SignUpCommand({
      ClientId: clientId,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    });
  
    return client.send(command);
};  
const cognitoSignUpHandler = (data)=>{
    data.clientId = window.CONFIG.clientId
    const response = signUp(data)
    console.log(response)
}

export { signUp };
