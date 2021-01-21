import React from 'react';
function LoginButton(props){
    function change(){
        props.view('login');
    }
    return(
        <button onClick={()=>{props.view('login')}}>Login</button>
    )
}

export default LoginButton;