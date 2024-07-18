// on submit form build JS obj and send it to cognitoSignUpHandler
document.querySelector('#signUpForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    formDataObj = Object.fromEntries(new FormData(e.target))
    cognitoSignUpHandler(formDataObj)
})

function cognitoSignUpHandler(data){
    console.log(data)
}
    