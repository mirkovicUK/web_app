///////////////////////////////////////////////////////////////////////////
//####### Helpers #########################################################
///////////////////////////////////////////////////////////////////////////

import {
    drawAwailableUsername,
    drawAwailableEmail,
    drawUnawailableUsername,
    drawUsernameError,
    drawEmailError,
    updateUsername,
    updateEmail,
    drawUnawailableEmail,

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

function isOneWord(str){
    return str.split(' ').length === 1
}

async function usernameHandler(username){
    try {    
        //fetch lambda to check if username is available
        username = username.trim()
        updateUsername(username)
        if(username === ''){
            throw {name : "UsernameNotAllowed", message : "Username cannot be empty."}
        }
        if(!isOneWord(username)){
            throw {name : "UsernameNotAllowed", message : "One word username only."}
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
        //200 response path username is available
        if(rawResponse.status === 200){
            drawAwailableUsername(username)
        }
        //user name not available 401 from server send list of possibilities 
        else{
            const content = await rawResponse.json()
            console.log(content)
            drawUnawailableUsername(content, username)
        }
    }catch (error) {
        if (error.name === "UsernameNotAllowed"){
            drawUsernameError(error.message)
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
        if(email === ''){
            throw {name : "UsernameNotAllowed", message : "Email cannot be empty."}
        }
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
        //200 response path email is available
        if(rawResponse.status === 200){
            drawAwailableEmail(email)
        }else{
            const content = await rawResponse.json()
            drawUnawailableEmail(content, email)
        }
    } catch (error) {
        if (error.name === "UsernameNotAllowed"){
            drawEmailError(error.message)
        }else{
            console.log('This is from emailHandler() Error:\n',error)
        throw error
        }
    }
}


export {
    showPassword,
    getRandomInt,
    usernameHandler,
    emailHandler,
}