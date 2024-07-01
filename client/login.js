const call_api = () =>{
    // set headers
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    // get form data
    const form = document.getElementById("login_form");
    const formData = new FormData(form)
    // /get stringify json
    const raw = JSON.stringify(get_body(formData))
    const requestOptions={
        method: 'GET',
        headers: myHeaders,
        body : raw,
        redirect : 'follow'
    }

    console.log(raw)

}

const get_body = (data) =>{
    // takes FormData obj returns json    
    obj = {}
    for (const [key, val] of data){
        obj[key]=val
    }
    return obj
}