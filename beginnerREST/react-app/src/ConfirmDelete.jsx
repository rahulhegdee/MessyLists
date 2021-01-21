import React from 'react';
import Cookies from 'universal-cookie';
function ConfirmDelete(props){
    const cookies = new Cookies();
    function deleteAccount(){
        let username = props.user;
        fetch('http://localhost:8080/userdelete',{
            'method': 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({'username':username})
        })
        .then(response => console.log(response))
        .catch(err => console.log(err));

        cookies.remove('token',{path:'/'});
        props.back('title');
        //are you sure popup
    }
    return(
        <button onClick={deleteAccount}>yes</button>
    )
}

export default ConfirmDelete;