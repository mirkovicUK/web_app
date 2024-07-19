window.CONFIG = {
    clientId: '2ajliukud2ofqp5l4nu939srks', //cognito app client id
}

// on submit form build JS obj and send it to cognitoSignUpHandler
document.querySelector('#signUpForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    formDataObj = Object.fromEntries(new FormData(e.target))
    cognitoSignUpHandler(formDataObj)
})

function cognitoSignUpHandler(data){
    console.log(data)
    console.log(showPassword())
    const client = new CognitoIdentityProviderClient({})
    const command = new SignUpCommand({
        ClientId : window.CONFIG.clientId,
        Username : data.username,
        Password : data.password,
        UserAttributes : [{Name:'email', Value:data.email}, {Name:'custom:paid_subscription', Value:'false'}]
    })
    console.log(client.send(command))  //async call
}

    