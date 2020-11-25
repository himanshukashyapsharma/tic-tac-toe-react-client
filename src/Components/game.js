import React,{useState, useEffect} from 'react'
import io from "socket.io-client";
import queryString from "query-string";
import "../App.css"

let socket

// 0 is for 'null' on not played, 1 is for '0' and 2 is for 'x'
//i is row and j is column


function game({location}) {

    const [Board,setBoard] = new useState([[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']])
    const [IsPlayed,setIsPlayed] = new useState([[false,false,false],[false,false,false],[false,false,false]])
    const [RoomData,setRoomData] = new useState() // use this to implement user names
    const ENDPOINT = "http://localhost:5000/"
    console.log(Board)

    new useEffect(()=>{
        const {name,room} = queryString.parse(location.search)

        // sends connection request to the ENDPOINT server
        socket = io(ENDPOINT)
        //send join message to server side while comonent loads
        socket.emit("join",{name,room})
        //sends disconnect message to server when component reloads or unloads
        return ()=>{
            socket.emit("disconnect user")
        }
    },[ENDPOINT,location.search])

    new useEffect(()=>{

        //listens for and updates messages array when message is recieved from server side

        //.once prevents from creating multiple listeners on server side
        //using socket.on will lead to creating multiple listeners on server side whenever client side is reloaded
        //or if it has multiple clients
        
        // recieves message from server
        socket.once("2playturn",({i,j,value})=>{   
            // set board value according to the values and position recieved by other user and prevent them form being clickable too.
            let newBoard = Board
            let newArray = Board[i]
            newArray[j] = 'X'
            setBoard([...newBoard])
        })

        // reloads whenever messages array is updated
    },[Board])

    // new useEffect(() => {
    //     socket.once("roomData",({room,users}) => {
    //         if(users.length == 1) setSymbol('O')
    //         if(users.length == 2) setSymbol('X')
    //     })
    // },[])

    const playTurn = (event) => {
        event.preventDefault()
        let i = event.target.getAttribute('i')
        let j = event.target.getAttribute('j')
        console.log(i,j)
        let value = event.target.value
        //sends message only if message variable is not null
        /////////////////"playTurn" was previously message 
            socket.emit("1playTurn",{i,j,value},()=> {
                let arrayRow = [...Board[i]]
                let BooleanRow = [...IsPlayed[i]]
                BooleanRow[j] = true
                arrayRow[j] = 'O'
                let newArrayBoard = Board
                let newBooleanArray = IsPlayed
                newBooleanArray[i] = BooleanRow
                newArrayBoard[i] = arrayRow
                setBoard(newArrayBoard)
            })
        console.log(Board)
    }


    return (
        <div>
            <div className="board">
                <button onClick={playTurn} i={0} j={0} className="board-box" value={Board[0][0]}>{Board[0][0]}</button>
                <button onClick={playTurn} i={0} j={1} className="board-box" value={Board[0][1]}>{Board[0][1]}</button>
                <button onClick={playTurn} i={0} j={2} className="board-box" value={Board[0][2]}>{Board[0][2]}</button>
                <button onClick={playTurn} i={1} j={0} className="board-box" value={Board[1][0]}>{Board[1][0]}</button>
                <button onClick={playTurn} i={1} j={1} className="board-box" value={Board[1][1]}>{Board[1][1]}</button>
                <button onClick={playTurn} i={1} j={2} className="board-box" value={Board[1][2]}>{Board[1][2]}</button>
                <button onClick={playTurn} i={2} j={0} className="board-box" value={Board[2][0]}>{Board[2][0]}</button>
                <button onClick={playTurn} i={2} j={1} className="board-box" value={Board[2][1]}>{Board[2][1]}</button>
                <button onClick={playTurn} i={2} j={2} className="board-box" value={Board[2][2]}>{Board[2][2]}</button>
            </div>
        </div>
    )
}

export default game
