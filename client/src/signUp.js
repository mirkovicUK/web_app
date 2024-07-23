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
listeners()


/////////////////////////////////////////////////////////////////////////////////////
//####### Helpers #########################################################
///////////////////////////////////////////////////////////////////////////////////

function showPassword(){
    const x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/////////////////////////////////////////////////////////////////////////////////////
//####### Cognito signUp #########################################################
///////////////////////////////////////////////////////////////////////////////////

import {
    SignUpCommand,
    CognitoIdentityProviderClient,
    UsernameExistsException,
    AdminGetUserCommand,
    UserNotFoundException
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
    data.UserPoolId = window.CONFIG.UserPoolId
    try {
        const response = await signUp(data)
        if(response['$metadata'].httpStatusCode === 200){
            successfulSignUp()
        }
    } catch (error) {
        if(error instanceof UsernameExistsException){
           usernameExistsExceptionHandler(data)
        }else{
            throw error
        }
    }
}

function getUser({UserPoolId, username, region='eu-west-2'}){
    const client = new CognitoIdentityProviderClient({region});
    const input = { 
        UserPoolId: UserPoolId,
        Username: username, 
    }
    console.log(input)
    const command = new AdminGetUserCommand(input);
    return client.send(command);
}

//return true if username is available
async function findAwailableUsername(data){
    console.log(data)
    try {
        const response = await getUser(data)
        if(response['$metadata'].httpStatusCode === 200) return false
    } catch (error) {
        if(error instanceof UserNotFoundException) return true
        else throw error
    }
}


    //color username text in red insert popover with some sugestions
async function usernameExistsExceptionHandler(data){
    let usernameSuggestions = data.username
    const obj = {
        UserPoolId:data.UserPoolId,
        username:usernameSuggestions
    }

    console.log( await findAwailableUsername(obj), '<---findawailableusername')
    // while(! await findAwailableUsername(obj)){
    //     obj.username += getRandomInt(99).toString()
    //     usernameSuggestions = obj.username
    //     console.log('WHILE')
    // }
    const value = document.getElementById('userName').value

    document.querySelector('#userName').addEventListener("mouseleave", (event)=>{
        document.getElementById('userName').value = usernameSuggestions
        obj.username = value
        console.log(value, '<-----')
        // while(!findAwailableUsername(obj)){
        //     obj.username = value + getRandomInt(99).toString()
        //     usernameSuggestions = obj.username
        //     console.log('WHILE')
        // }
        
        const snippet = `<button type="button" class="btn btn-sm btn-transparent" 
        data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="left" title="Available:" 
        data-bs-content="${usernameSuggestions}"><span class="text-red">
        Hover over to try another? </span></button>`
        document.getElementById('userNameHelp').innerHTML = snippet
        //reinitialise popover
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl)
        })  
    })
    const snippet = `<button type="button" class="btn btn-sm btn-transparent" 
        data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="left" title="Available:" 
        data-bs-content="${usernameSuggestions}"><span class="text-red">
        Someone alredy has that username. Try another?</span></button>`
        document.getElementById('userNameHelp').innerHTML = snippet
        //reinitialize popover
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl)
        })   
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

export {
    signUp,
    cognitoSignUpHandler,
    showPassword,
    getUser,
    findAwailableUsername,
};
