import React from 'react';
import Cookies from 'universal-cookie';
function LoginForm(props){
    const [verified, setVerified] = React.useState(null); //three states: null - Submit hasn't been pressed yet, false - Submit pressed and username not found, true - Username found
    const cookies = new Cookies();
    async function verifyAccount(){
        let userName = document.getElementById('username').value;
        let passWord = document.getElementById('password').value;
        await fetch('http://localhost:8080/account',{
            'method':'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({'username':userName, 'password':passWord})
        })
        .then(response => response.json())
        .then(response => {
            if(response.message === 'unverified'){
                setVerified(false);
            }
            else{
                cookies.set('token',response, {path:'/',expires:new Date(Date.now()+(1000*60*60))});
                setVerified(true);
            }
        })
        //.then(props.user)
        .catch(err => console.log(err))
    }
    function handleSubmit(event){
        event.preventDefault();
        verifyAccount(); 
    }
    function back(){
        props.back('title');
    }
    React.useEffect(()=>{
        if(verified){
            props.submit();
        }
    })
    return(
        <form onSubmit={handleSubmit}>
            <h1>Welcome!</h1>
            <label htmlFor='username'>Username:</label><br/>
            <input type='text' id='username' required></input>
            <br/>
            <label htmlFor='password'>Password:</label><br/>
            <input type='password' id='password' required></input>
            <br/>
            {verified === false && <label style={{color:'red'}}>Incorrect Username or Password.</label>}
            <br/>
            <input type='submit'></input>
            <input type='button' value='Back' onClick={back}></input>
        </form>
    )
}

export default LoginForm;