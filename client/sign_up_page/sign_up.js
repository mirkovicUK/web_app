// const call_api = () =>{
//     // set headers
//     const myHeaders = new Headers()
//     myHeaders.append("Content-Type", "application/json")
//     // get form data
//     const form = document.getElementById("login_form");
//     const formData = new FormData(form)
//     // get json and stringify
//     const raw = JSON.stringify(get_body(formData))
//     console.log(raw)
//     const requestOptions={
//         method: 'POST',
//         headers: myHeaders,
//         body : raw,
//         redirect : 'follow'
//     }

//     fetch("https://3fm4kafox0.execute-api.eu-west-2.amazonaws.com/test/helloworld", requestOptions)
//             .then(response => response.json())
//             .then(result => alert(result))
//             .catch(error => alert(error));

//     document.getElementById('login_form').reset()
// }

const get_body = (data) =>{
    // takes FormData obj returns json object
    obj = {}
    for (const [key, val] of data){
        obj[key]=val
    }
    return obj
}

const registerButton = ()=>{
    // get form data
    const form = document.getElementById("login_form");
    const formData = new FormData(form)
    formDataObj = get_body(formData)

    poolData ={
        UserPoolId : _config.cognito.userPoolId,
        ClientId : _config.cognito.clientId
    }

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
    const attributeList = []

    const dataEmail = {
        Name : 'email',
        Value : formDataObj.email
    }
    const dataName = {
        Name : 'Name',
        Value : formDataObj.first_name
    }

    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)
    // const attributePersonamName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName)

    attributeList.push(attributeEmail)

    
    userPool.signUp(formDataObj.username, formDataObj.password, attributeList, null, function(err, result){
        if(err){
            alert(err.message || JSON.stringify(err))
            return
        }
        cognitoUser = result.user
        console.log('user name is ' + cognitoUser.getUsername())

    })
    console.log(formDataObj)
}
