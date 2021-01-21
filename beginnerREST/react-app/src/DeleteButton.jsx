import React from 'react';
function DeleteButton(props){
    function initiate(){
        props.initiate(true);
    }
    return(
        <button onClick={initiate}>Delete Account</button>
    )
}

export default DeleteButton;