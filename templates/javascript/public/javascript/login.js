import axios from 'axios'

const form = document.querySelector('#loginform');

const login= (email,password)=> {
    try{
        const res =await axios.post('128.0.0.1:8000/api/v1/login', {email, password});
        console.log(res)
        
        setTimeout(() => {
            window.location.replace('128.0.0.1:8000/')
        }, 1000);   
    } catch(err) {
        console.log(err)
        document.querySelector('#error').innerHTML(`<span>${err.response.data.message}</span>`)
    }
};

form.addEventListener('submit',async e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password)
});