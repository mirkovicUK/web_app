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

        //listens for email imput field to 
        //check availability b4 submition is clicked
        document.querySelector('#exampleInputEmail1').addEventListener('input', (e)=>{
            const email = e.target.value
            emailHandler(email)
        })

        //listens for username imput field to 
        //check availability b4 submition is clicked
        document.querySelector('#userName').addEventListener('input', (e)=>{
            const username = e.target.value
            usernameHandler(username)
        })

}
// uncoment b4 npm run build command
listeners()


///////////////////////////////////////////////////////////////////////////
//####### Helpers #########################################################
///////////////////////////////////////////////////////////////////////////
import {
    showPassword,
    getRandomInt,
    usernameHandler,
    emailHandler,
} from './helper'

//////////////////////////////////////////////////////////////////////
//####### Cognito signUp ##############################################
//////////////////////////////////////////////////////////////////////
import {
    SignUpCommand,
    CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import {cognitoSignUpHandler} from './cognitoSignUpHandler'

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

function invalidPasswordExceptionHandler(errorMsg){
    const error = errorMsg.split(':')[1]

    // username remains with red text under after invalidParameterExceptionHandler
    // this reset it 
    const userName = document.getElementById('userName').value
    if(userName.length >= 1){
        const divUsername = document.getElementById('userNameHelp')
        divUsername.classList.add('text-red')
        divUsername.innerHTML = ''
    }

    const snippet = `<button type="button" class="btn btn-sm btn-transparent" 
        data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="left" 
        title="Password:" 
        data-bs-content="Min 8 character(s): number, special character, 
        uppercase and lowercase letter"><span class="text-red">
        ${error}</span></button>`
    document.getElementById('passwordHelp').innerHTML = snippet
    //reinitialize popover
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
}


//to be called when user is added to cognito 
const successfulSignUp = ()=>{
    const snippet = `<div class="alert alert-success alert-dismissible fade show" role="alert">
  <h4 class="alert-heading">Well done!</h4>
  <p>A verification email has been sent to your email address</p>
  <hr>
  <p class="mb-0">Please click on the link that been sent to your email account to verify your email and complete registration process.</p>
  <button onclick="location.href='index.html';" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`

    document.getElementById('mainDiv').innerHTML = snippet
}

const invalidParameterExceptionHandler = (errorMsg)=>{
    const password = document.getElementById('password').value
    const userName = document.getElementById('userName').value
    
    const divUsername = document.getElementById('userNameHelp')
        divUsername.classList = divUsername.classList.forEach(
            (el)=> el !== 'text-green'
        )
    const divPassword = document.getElementById('passwordHelp')
    if(password.length < 2){
        divPassword.classList.add('text-red')
        divPassword.innerHTML = 'Password must be Min 8 character(s)'
    }

    if(password[0] === ' '){
        divPassword.classList.add('text-red')
        divPassword.innerHTML = 'Password can not start with whitespace'
    }
    if(password.slice(-1) === ' '){
        divPassword.classList.add('text-red')
        divPassword.innerHTML = 'Please remove whitespace from the end of password'
    }

    if(userName.length < 1){
        divUsername.classList.add('text-red')
        divUsername.innerHTML = 'Username cannot be empty'
    }
    else{
        divUsername.classList.add('text-red')
        divUsername.innerHTML = ''
    }
}

function drawAwailableUsername(userName){
    const divUsername = document.getElementById('userNameHelp')
    divUsername.classList.add('text-green')
    divUsername.innerHTML = `${userName} is Available Username`
}

function drawUnawailableUsername(awailableUsernameList, userName){
    let awailableUsername = ''
    if(awailableUsernameList){
        const randInt = getRandomInt(awailableUsernameList.length)
        awailableUsername = awailableUsernameList[randInt]
    }else{
        awailableUsername = 'typing new one'
    }
    
    const divUsername = document.getElementById('userNameHelp')
    divUsername.classList = divUsername.classList.forEach(
        (el)=> el !== 'text-green'
    )
    divUsername.classList.add('text-red')
    divUsername.innerHTML = `Unfortunately ${userName} is not available.
    Try <button type="button" id="button" class="link text-green ">${awailableUsername}</button> insted?`
    const button = document.getElementById('button')
    button.classList.add('button_noborder')
    document.querySelector('#button').addEventListener('click',(e)=>{
        document.getElementById('userName').value = awailableUsername
    })
}

function drawOneWordUsernameError(msg){
    const divUsername = document.getElementById('userNameHelp')
    divUsername.classList = divUsername.classList.forEach(
        (el)=> el !== 'text-green'
    )
    divUsername.classList.add('text-red')
    divUsername.innerHTML = msg
}
// remove leading and trailing white spaces
function updateUsername(userName){
    document.getElementById('userName').value = userName
}

function updateEmail(email){
    console.log(email)
    document.getElementById('exampleInputEmail1').value = email
}

function usernameExistsExceptionHandler(){
}
export {
    signUp,
    invalidPasswordExceptionHandler,
    successfulSignUp,
    invalidParameterExceptionHandler,
    drawAwailableUsername,
    drawUnawailableUsername,
    drawOneWordUsernameError,
    updateUsername,
    updateEmail,
    usernameExistsExceptionHandler,
};
