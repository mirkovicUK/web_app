import { fileURLToPath } from "url"
import {
    AuthFlowType,
    InitiateAuthCommand,
    UsernameExistsException,
    paginateListUserPools,
    SignUpCommand,
    CognitoIdentityProviderClient,
    ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider"





export const helloCognito = async () => {
    const client = new CognitoIdentityProviderClient({});
    const paginator = paginateListUserPools({ client }, {});
  
    const userPoolNames = [];
  
    for await (const page of paginator) {
      const names = page.UserPools.map((pool) => pool.Name);
      userPoolNames.push(...names);
    }
  
    console.log("User pool names: ");
    console.log(userPoolNames.join("\n"));
    return userPoolNames;
};

export const signUp = (clientId, username, password, email)=>{
    const client = new CognitoIdentityProviderClient({})
    const command = new SignUpCommand({
        ClientId : clientId,
        Username : username,
        Password : password,
        UserAttributes : [{Name:'email', Value:email}, {Name:'custom:paid_subscription', Value:'false'}]
    })

    return client.send(command)
    
}

const listUsers = ({userPoolId})=>{
    const client = new CognitoIdentityProviderClient({})
    const command =  new ListUsersCommand({
        UserPoolId : userPoolId
    })

    return client.send(command)
}

const initiateAuth = ({username, password, clientId})=>{
    const client = new CognitoIdentityProviderClient({})
    const command = new InitiateAuthCommand({
        AuthFlow : AuthFlowType.REFRESH_TOKEN_AUTH,
        AuthParameters:{
            REFRESH_TOKEN : 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.Tkpv0nC87WG8fQO5D0gyOcDe_AznexdiNdgsDkQdecEuTlJnzWkRRWpxdEMX5sU6rm41k0GBErhi6sRq6UTGynDnrKo1IlHMk4jXwRpX4Cvrj0LtGCl1JoRyTVICZvlhlI1P04stwtxMhpybnVTvGJVxWKe7zVZvve8PEof1fZ3wTn9g3rUOh_YUkibWYteQbuhn7fVA0xGN7Gn4ovsfbeKaCEQzbbcWpFdmkevbVyl7kuRHR5ehOpTDo-l8eItb6z3-oSk2kdPvm5_KJNo0koXjm5q5eJ9X7DVPjlnmhtEcNQLe7op2rO18uOPOBRvGkECEjcMy8JaNP9PRGbk1NA.ybuj1-Nf_WjH7Oi5.9okmT-ZaraF7S7Ro2AyyMaDY2p-_OIUXcNaFmEIyzJbRu_UDERJFcHkeEq9w-Fj5HnjNd0Ee2VaC_11pVhxYHWr8qlfAE7LkO6w_Dy_ndeaz9UYxu0bJ-2MaMYwA1YcWj8Vyfa70HRaWn_3FE7Y-PinbVKFQ25uSjmxf5Y8dPhTCg2TE6p8LJU_vawA97k3m0pwaCn1E6p0ysWHE4bn_AWvH9j_M7TiCl8S1iMP0RCDfrd6G2--Th4DWeBGQhTWLAKt4mCPcD2BAxpAg2oFVFziypEBSaPAxOX25kSmpkKDc0ZmT8jVZLAedVPVYte6FnfbNkCDACuTY-1t6_tOIWQiu421Be0-WX9_UeAd4GAf_6mlJLF2vQ11qLYQwd67KtXbyebCxzSJijtQUgE9fll2x9DsiF6mLcJKBOhvA6B8EMS-HJ_cmo4d2ZKxMcbSsxIXjdHQRC_czObDQM-kpF62KK76VkocpwjPsQUNhbAnF6RNCnUChpcHAuSHd9gWo6znbVwE98GynINdtMzirktGp05P0WZnt2lLJV2xKZhJvmkKILg5I5JtnDr9CpcJJrbZecz_l32vYKfpYlU9DxdbWZB3dJDm7glEPH0Go_vemLPBvqd2u9WBg06QDyqBJcmJnM0Br7S2r1yaTVGY5mtq-_UoDk1Xpc-mtxJ68pJ9n5r5zciBYVqLVGdu777kROh0VyEb7o0JmuPE_uLWoxPgwvKwlUVa_VyKgsu_dYDWrxYoMSY0nj940Zxv--S4XhWUHZn9-lg7tst8j2dLnOrZjsxzc0oZo7N7oqyqz2M4GBLJsNYeSPaKS1jS-ttShGkwE8sbU7PiBAme5_vVvPeMOzlu0weSmyTcK9dXZLJvDMA6E6UES1aECh7SPqPr8nwjVoI2Y0pZCMYNus_kU8wpvLwk9ghNYjLmSVYYV7MV7h_v_yRjsrZqNO_ydV_aTfp_AK0bXu5Rkwb-q38D0VTn_pZcLKWkWhg7AD_VHQWxq6P-nrPi0HTGrVj_pA_w6M5S7vGPM3Xu9fbVXEbKzwQzn5oUNcObk8hP6dLnzRMpqX04SvxaHRLrrVCvAWf59xiJjR0qY3ETZiZUFqPjRmtDnLLKuvZ9Lrf4ESrMr_aYTzaw6TI_1t2IORfdcjUp4d2HtoqQ1M0xqsHuunxPCphimnv0Lehyjybq4Ip6wIgB9I-rkuK_5S3Ql0zs-XmRop_h5YUITU3a0X6xkrP2tx2hibE432UR2j5kjxdiU0idf0MbK_XYUmBy3ZD32hnxY7bY.EnZck0smvI7GTDSzt3bD4A',
        },
        ClientId : clientId
    })
    return client.send(command)
}

if(fileURLToPath(import.meta.url) === process.argv[1]){
    console.log(import.meta.resolve())
    
    try{
        const response = await initiateAuth({
            username : 'uros1',
            password : 'aaA111$$$1',
            clientId : '2ajliukud2ofqp5l4nu939srks'
        })
        console.log(response)
    }
    catch(err){
        console.log(err.mesage)
        throw err
    }
    
    // try{
    //     const response = await listUsers({userPoolId:'eu-west-2_Zzl6pXO5x'})
    //     const users = response.Users
    //     for(const user of users){
    //         for(const attribute of user.Attributes){
    //             if(attribute.Name == 'custom:paid_subscription'){
    //                 console.log(attribute.Value)
    //             }
    //         }
    //     }
    // }
    // catch(err){
    //     console.log(err.message)
    //     throw err
    // }

   

    // try{
    //     var userName = 'uros1'
    //     const response = await signUp(
    //         '2ajliukud2ofqp5l4nu939srks',
    //         userName,
    //         'aaA111$$$1',
    //         'mirkovic.uk@gmail.com'
    //     )
    
    //     if (response['$metadata'].httpStatusCode === 200){
    //         console.log('User created chears, pls verify email')
    //     }
    // }
    // catch(err){
    //     if(err instanceof UsernameExistsException){
    //         console.log(`alert user: \n User name:${userName} exists`)
    //     } else {
    //         throw err
    //     }
    // }

    // helloCognito()
    
}



