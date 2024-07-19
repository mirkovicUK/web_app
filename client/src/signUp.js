function showPassword(){
    const x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}



document.querySelector('input[type=checkbox]').
addEventListener('change', ()=>{
    showPassword()
})



