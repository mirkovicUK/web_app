window.CONFIG = {
    clientId: '2ajliukud2ofqp5l4nu939srks', //cognito app client id
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

// on submit form build JS obj and send it to cognitoSignUpHandler
document.querySelector('#signUpForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    formDataObj = Object.fromEntries(new FormData(e.target))
    // cognitoSignUpHandler(formDataObj)
    console.log(formDataObj)
})


