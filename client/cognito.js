import { fileURLToPath } from "url"
import {
    paginateListUserPools,
    SignUpCommand,
    CognitoIdentityProviderClient,
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
        UserAttributes : [{Name:'email', Value:email}]
    })

    return client.send(command)
}

if(fileURLToPath(import.meta.url) === process.argv[1]){
    try{
        var userName = 'uros'
        const response = await signUp(
            '2ajliukud2ofqp5l4nu939srks',
            userName,
            'aaA111$$$1',
            'mirkovic.uk@gmail.com')}
    catch(err){
        if(err.name === 'UsernameExistsException'){
            console.log(`alert user: \n User name:${userName} exists`)
        } else {
            throw err
        }
    }
}



