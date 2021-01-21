import React from 'react';

function CreateAccount(props){
    return(
        <button onClick={()=>{props.view('create')}}>Create Account</button>
    )
}

export default CreateAccount;