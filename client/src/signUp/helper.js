///////////////////////////////////////////////////////////////////////////
//####### Helpers #########################################################
///////////////////////////////////////////////////////////////////////////

import {
    drawAwailableUsername,
    drawUnawailableUsername,
    drawOneWordUsernameError,
    updateUsername,
    updateEmail,

} from "./signUpA";

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

function isUsernameOneWord(username){
    return !(username.split(' ').length > 1)
}

async function usernameHandler(username){
    try {    
        //fetch lambda to check if username is available
        username = username.trim()
        updateUsername(username)
        if(!isUsernameOneWord(username)){
            throw {name : "UsernameNotAllowed", message : "Only one word username is allowed"}
        }
        const header = new Headers()
        header.append("Content-Type", "application/json")
        const raw = JSON.stringify({username:`${username}`})
        const requestOptions = {
            method : 'POST',
            headers : header,
            body : raw,
        }
        const url = 'https://3fm4kafox0.execute-api.eu-west-2.amazonaws.com/test/helloworld'
        const request = new Request(url, requestOptions)
    
        const rawResponse = await fetch(request)
        console.log(rawResponse)
        //200 response path username is available
        if(rawResponse.status === 200){
            drawAwailableUsername(username)
        }
        //user name not available 401 from server send list of possibilities 
        else{
            const content = await rawResponse.json()
            drawUnawailableUsername(content, username)
        }
    }catch (error) {
        if (error.name === "UsernameNotAllowed"){
            drawOneWordUsernameError(error.message)
        }else{
            console.log('This is from usernameHandler() Error:\n',error)
        throw error
        }
    }
}

async function emailHandler(email) {
    try {
        email = email.trim()
        updateEmail(email)
        const header = new Headers()
        header.append("Content-Type", "application/json")
        const raw = JSON.stringify({email:`${email}`})
        const requestOptions = {
            method : 'POST',
            headers : header,
            body : raw,
        }
        const url = 'https://3fm4kafox0.execute-api.eu-west-2.amazonaws.com/test/helloworld'
        const request = new Request(url, requestOptions)
        const rawResponse = await fetch(request)
        console.log(rawResponse)
    } catch (error) {
        console.log('This is from emailHandler() Error:\n',error)
        throw error
    }
}


export {
    showPassword,
    getRandomInt,
    usernameHandler,
    emailHandler,
}