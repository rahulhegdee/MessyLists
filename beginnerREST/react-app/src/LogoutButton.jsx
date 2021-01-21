import React from 'react';
import Cookies from 'universal-cookie';

function LogoutButton(props){
    const cookies = new Cookies();
    function logout(){
        cookies.remove('token',{path:'/'});
        props.back('title');
    }
    return(
        <button onClick={logout}>Logout</button>
    )
}

export default LogoutButton;