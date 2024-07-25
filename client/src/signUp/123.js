import {
    UsernameExistsException,
    InvalidPasswordException,
    InvalidParameterException
} from "@aws-sdk/client-cognito-identity-provider"
import {
    usernameExistsExceptionHandler,
    invalidPasswordExceptionHandler,
    signUp,
    successfulSignUp,
    invalidParameterExceptionHandler
} from './signUp'

//function starts here
async function cognitoSignUpHandler (data){
    data.clientId = window.CONFIG.clientId
    data.UserPoolId = window.CONFIG.UserPoolId
    data.region = window.CONFIG.region
    try {
        const response = await signUp(data)
        if(response['$metadata'].httpStatusCode === 200){
            successfulSignUp()
        }
    } catch (error) {
        if(error instanceof UsernameExistsException){
           usernameExistsExceptionHandler(data)
        }else if (error instanceof InvalidPasswordException){
            invalidPasswordExceptionHandler(error.message)
        }else if (error instanceof InvalidParameterException){
            invalidParameterExceptionHandler(error.message)   
        }else{
            console.log('from cognitoSignUpHandler() uncought error')
            console.log(error.message)
            throw error
        }I wont to see this
    }
}
//function ends here

export{cognitoSignUpHandler}