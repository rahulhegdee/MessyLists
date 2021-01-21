import React from 'react';

function DenyDelete(props){
    function uninitiate(){
        props.initiate(false);
    }
    return(
        <button onClick={uninitiate}>no</button>
    )
}

export default DenyDelete;