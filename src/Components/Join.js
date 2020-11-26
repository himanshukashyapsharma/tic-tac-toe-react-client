import React, {useState} from "react"
import {Link} from "react-router-dom"
import "./join.css"

const Join = ()=> {

    const [Name,setName] = useState("")
    const [Room,setRoom] = useState("")
    const [DialgoueBoxStyle,setDialgoueBoxStyle] = useState({
        display: 'none'
    })
    const [ContainerStyle,setContainerStyle] = useState({
        backgroundColor: '#F3EED9'
    })

    const [ButtonStyle,setButtonStyle] = useState({
        display: 'block'
    })

    const openDialogueBox = () => {
        setDialgoueBoxStyle({
            display: 'block'
        })
        setButtonStyle({
            display: 'none'
        })
        setContainerStyle({
            backgroundColor: '#F3EED9'
        })
    }

    function nameHandler(event){
        setName(event.target.value)
    }

    function roomHandler(event){
        setRoom(event.target.value)
    }
    
    return (
        <div className="join-container" style={ContainerStyle}>
            <h1>Tic Tac Toe</h1>
            <div className="dialgoue-box" style={DialgoueBoxStyle}>
                    <div className="input-container">
                        <label>Name:</label>
                        <div><input placeholder="Enter your name" className="join-input" onChange={nameHandler} autoFocus/></div>
                    </div>
                    <div className="input-container">
                        <label>Room:</label>
                        <div><input placeholder="Enter room number" className="join-input" onChange={roomHandler} /></div>
                    </div>
                    
                    <div>
                        <Link 
                        onClick={event=> (!Name || !Room)?event.preventDefault():null}
                        to={`/game?name=${Name}&room=${Room}`}>
                            <button className="button">Sign In</button>
                        </Link>
                    </div>
            </div>
            <div>
                <button className="button2" style={ButtonStyle}onClick={openDialogueBox}>Join</button>
            </div>
        </div>

    )
}

export default Join