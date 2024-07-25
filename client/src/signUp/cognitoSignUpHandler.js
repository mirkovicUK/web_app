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
        
const window={}
window.CONFIG = {
    clientId: '2ajliukud2ofqp5l4nu939srks', 
    region: 'eu-west-2',
    UserPoolId: 'eu-west-2_Zzl6pXO5x'
}

export const cognitoSignUpHandler = async (data)=>{
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
        }
    }
}