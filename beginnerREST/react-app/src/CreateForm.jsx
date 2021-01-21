import React from 'react';
import Cookies from 'universal-cookie';
function CreateForm(props){
    const [passMatch, letPassMatch] = React.useState(true);
    const [userExists, letUserExists] = React.useState(false);
    const [verified, setVerified] = React.useState(false); 
    const [userMet, letUserMet] = React.useState(true);
    const [userLength, letUserLength] = React.useState(true); //true - good length, null - too short, false - too long
    const cookies = new Cookies();
    function passCheck(){
        let passOne = document.getElementById('initPassword').value;
        let passTwo = document.getElementById('retypePassword').value;
        if(passOne.length == 0 || passTwo.length == 0){letPassMatch(true); return;}
        if(passOne === passTwo){
            letPassMatch(true);
        }
        else{
            letPassMatch(false);
        }
    }
    function checkUsername(){
        let userName = document.getElementById('username').value;
        if(userName.length == 0){letUserMet(true); letUserLength(true); letUserExists(false); return;}
        //we only want to return when there are errors with the username, if one condition is met we still need to check others
        if(userName.match(/^[0-9a-zA-Z]+$/)){
            letUserMet(true);
        }
        else{
            letUserMet(false);
            return;
        }

        if(userName.length < 3){letUserLength(null); return;}
        else if(userName.length >= 3 && userName.length < 64){letUserLength(true);}
        else{letUserLength(false); return;}

        letUserExists(false);
        fetch('http://localhost:8080/usernames',{
            'method': 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({'username':userName})
        })
        .then(response => response.json())
        .then(response => {
            letUserExists(response);
        })
        .catch(err => console.log(err));

    }
    async function createUser(){
        let userName = document.getElementById('username').value;
        let passWord = document.getElementById('initPassword').value;
        await props.user(userName, passWord);//adds user to Database
        fetch('http://localhost:8080/account',{
            'method':'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({'username':userName,'password':passWord})
        })
        .then(response => response.json())
        .then(response => {
            if(response.message === 'unverified'){
                setVerified(false);
            }
            else{
                cookies.set('token', response, {path:'/',expires:new Date(Date.now()+(1000*60*60))});
                setVerified(true);
            }
        })
        .catch(err => console.log(err))

        if(verified){
            props.submit();
        }
    }
    function handleSubmit(event){
        event.preventDefault();
        createUser();
    }
    function back(){
        props.back('title');
    }
    React.useEffect(() => {
        if(passMatch && !userExists && userMet && userLength){
            document.getElementById('submit').disabled = false;
        }
        else{
            document.getElementById('submit').disabled = true;
        }
        
        if(verified){
            props.submit();
        }
    });
    return(
        <form onSubmit={handleSubmit}>
            <h1>Welcome!</h1>
            <label htmlFor='username'>Username:</label><br/>
            <input type='text' id="username" onChange={() => {checkUsername();}} required></input>
            {!userMet && <label style={{color:'red'}}> Username should only contain letters and numbers! </label>}
            {userMet && (userLength==null) && <label style={{color:'red'}}> Username too short! </label>}
            {userMet && (userLength==false) && <label style={{color:'red'}}> Username too long! </label>}
            {userMet && userLength && userExists && <label style={{color:'red'}}> Username already exists!</label>}<br/>
            <label htmlFor='initPassword'>Password:</label><br/>
            <input type='password' required id="initPassword" onChange={() => {passCheck();}}></input><br/>
            <label htmlFor='retypePassword'>Retype Password:</label><br/>
            <input type='password' id="retypePassword" required onChange={() => {passCheck();}}></input>
            {!passMatch && <label style={{color:'red'}}> Password does not match!</label>}
            <br/>
            <input type="submit" id="submit"></input>
            <input type="button" value='Back' onClick={back}></input>
        </form>
    )
}

export default CreateForm;