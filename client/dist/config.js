window.CONFIG = {
    clientId: '2ajliukud2ofqp5l4nu939srks', //cognito app client id
    region: 'eu-west-2'
}

//signe in checkbox eventListener
function showPassword(){
    //overridden in signeUp.js
}
document.querySelector('input[type=checkbox]').
addEventListener('change', ()=>{
    showPassword()
})

// on submit form build JS obj and send it to cognitoSignUpHandler
function cognitoSignUpHandler(){
    //overridden in signeUp.js
}
document.querySelector('#signUpForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    const formDataObj = Object.fromEntries(new FormData(e.target))
    cognitoSignUpHandler(formDataObj)
})