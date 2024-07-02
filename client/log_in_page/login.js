const call_api = () =>{
    // set headers
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    // get form data
    const form = document.getElementById("login_form");
    const formData = new FormData(form)
    // get json and stringify
    const raw = JSON.stringify(get_body(formData))
    const requestOptions={
        method: 'POST',
        headers: myHeaders,
        body : raw,
        redirect : 'follow'
    }

    fetch("https://3fm4kafox0.execute-api.eu-west-2.amazonaws.com/test/helloworld", requestOptions)
            .then(response => response.json())
            .then(result => alert(result))
            .catch(error => alert(error));

    document.getElementById('login_form').reset()
}

const get_body = (data) =>{
    // takes FormData obj returns json object
    obj = {}
    for (const [key, val] of data){
        obj[key]=val
    }
    return obj
}