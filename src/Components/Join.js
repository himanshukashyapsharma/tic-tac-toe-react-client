import React, {useState} from "react"
import {Link} from "react-router-dom"

const Join = ()=> {

    const [Name,setName] = useState("")
    const [Room,setRoom] = useState("")

    function nameHandler(event){
        setName(event.target.value)
    }

    function roomHandler(event){
        setRoom(event.target.value)
    }
    
    return (
        <div className="join-outer-wrapper">
                    <label>Name:</label>
                    <div><input placeholder="Enter your name" className="join-input" onChange={nameHandler} autoFocus/></div>
                    
                    <label>Room:</label>
                    <div><input placeholder="Enter room number" className="join-input" onChange={roomHandler} /></div>
                    
                    <div className="button-wrapper">
                        <Link 
                        onClick={event=> (!Name || !Room)?event.preventDefault():null}
                        to={`/game?name=${Name}&room=${Room}`}>
                            <button className="button">Sign In</button>
                        </Link>
                    </div>
        </div>

    )
}

export default Join