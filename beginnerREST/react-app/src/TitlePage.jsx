import React from 'react';
import LoginButton from './LoginButton';
import CreateButton from './CreateAccount';

function TitlePage(props){
    return(
        <div>
            <h1>Welcome!</h1>
            <LoginButton view={props.view}/>
            <br/>
            <CreateButton view={props.view}/>
        </div>
    )
}

export default TitlePage;