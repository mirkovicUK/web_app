///////////////////////////////////////////////////////////////////////////
//####### Helpers #########################################################
///////////////////////////////////////////////////////////////////////////

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

async function usernameHandler(username){
    //fetch lambda to check if username is available
    const header = new Headers()
    header.append("Content-Type", "application/json")
    const raw = JSON.stringify({username:`${username}`})
    const requestOptions = {
        method : 'POST',
        headers : header,
        body : raw
    }
    const url = 'https://3fm4kafox0.execute-api.eu-west-2.amazonaws.com/test/helloworld'
    const request = new Request(url, requestOptions)
    try {
        const rawResponse = await fetch(request)
        console.log(rawResponse)
        //200 response path username is available
        if(rawResponse.status === 200){
            console.log('logic for successful response username awailable render it for user')
        }
        //user name not available 401 from server
        else{
            const content = await rawResponse.json()
            console.log('this is 401 path --->', content)
        }
    } catch (error) {
        console.log('This is from Error usernameHandler \n',error)
        throw error
    }
    
}

export {showPassword, getRandomInt, usernameHandler}