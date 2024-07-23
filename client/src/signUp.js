function listeners(){
        //signIn checkbox eventListener
        document.querySelector('input[type=checkbox]').
        addEventListener('change', ()=>{
            showPassword()
        })

        // on submit form build JS obj and send it to cognitoSignUpHandler
        document.querySelector('#signUpForm').addEventListener('submit',(e)=>{
        e.preventDefault();
        const formDataObj = Object.fromEntries(new FormData(e.target))
            cognitoSignUpHandler(formDataObj)
        })
}
// uncoment b4 npm run build command
// listeners()

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
    UsernameExistsException,
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
    try {
        const response = await signUp(data)
        if(response['$metadata'].httpStatusCode === 200){
            successfulSignUp()
        }
    } catch (error) {
        if(error instanceof UsernameExistsException){
           usernameExistsExceptionHandler()
        }else{
            throw error
        }
    }
}

function usernameExistsExceptionHandler(){
    //color username text in red insert popover with some sugestions
    console.log('write into div user name exist, give recomentadition')
    const usernameSuggestions = 'IDK'
    const snippet = `<a tabindex="0" class="btn btn-sm btn-transparent" 
    role="button" data-bs-toggle="popover" data-bs-trigger="focus" 
    title="SUGGESTIONS" data-bs-content="${usernameSuggestions}">
    Click me for suggestions:</a>`
    document.getElementById('userNameHelp').innerHTML = snippet
}

//to be called when user is added to cognito 
function successfulSignUp(){
    const snippet = `<div class="alert alert-success alert-dismissible fade show" role="alert">
  <h4 class="alert-heading">Well done!</h4>
  <p>A verification email has been sent to your email address</p>
  <hr>
  <p class="mb-0">Please click on the link that been sent to your email account to verify your email and complete registration process.</p>
  <button onclick="location.href='index.html';" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`

    document.getElementById ('mainDiv').innerHTML = snippet

  
}

export { signUp, cognitoSignUpHandler, showPassword };
