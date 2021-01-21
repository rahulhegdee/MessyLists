import React, {useState} from 'react';
import Cookies from 'universal-cookie';
import LogoutButton from './LogoutButton';
import DeleteButton from './DeleteButton';
import ConfirmButton from './ConfirmDelete';
import DenyButton from './DenyDelete';
function Welcome(props){
    const [affirmDelete, setAffirmDelete] = useState(false);
    function changAffirmDelete(affirmation){
        setAffirmDelete(affirmation);
    }
    const cookies = new Cookies();
    return(
        <div>
            <h1>Hello, {props.current.username}!</h1>
            <h1>You are account number {props.current.id}</h1>
            <LogoutButton back={props.back}/>
            <>  </>
            {!affirmDelete && <DeleteButton initiate={changAffirmDelete}/>}
            {affirmDelete && 
                <div>
                    <p>Are you sure? </p>
                    <ConfirmButton user={props.current.username} back={props.back}/>
                    <> </>
                    <DenyButton initiate={changAffirmDelete}/>
                </div>
            }
        </div>
    )
}

export default Welcome;