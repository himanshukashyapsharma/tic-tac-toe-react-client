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
    // const [RoomData,setRoomData] = new useState() // use this to implement user names
    const [UserWon, setUserWon] = new useState()
    const [IsTurn,setIsTurn] = new useState(true)
    const ENDPOINT = "http://localhost:5000/"

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
        
        // recieves position of second players move from server
        socket.once("2playturn",({i,j,newBooleanArray})=>{   
            // set board value according to the values and position recieved by other user and prevent them form being clickable too.
            let newBoard = Board
            let newArray = Board[i]
            newArray[j] = 'X'
            newBoard[i] = newArray
            setBoard([...newBoard])
            setIsPlayed([...newBooleanArray])
            setIsTurn(true)
        })

        // reloads whenever messages array is updated
    },[Board,IsTurn,IsPlayed])

    new useEffect(() => {
        for(let i=0;i<3;i++){
            //checking horizontal 
            if (Board[i][0] !== ' ' && Board[i][1] !== ' ' && Board[i][2] !== ' '){
                if(Board[i][0] === Board[i][1] && Board[i][1] === Board[i][2]){
                    setUserWon(Board[i][0])
                    break
                } 
            }
            //checking vertical rows
            if (Board[0][i] !== ' ' && Board[1][i] !== ' ' && Board[2][i] !== ' '){
                if(Board[0][i] === Board[1][i] && Board[1][i] === Board[2][i]){
                    setUserWon(Board[0][i])
                    break
                } 
            }
        }
        //checks diagonals
        if (Board[0][0] !== ' ' && Board[1][1] !== ' ' && Board[2][2] !== ' '){
            if(Board[0][0] === Board[1][1] && Board[1][1] === Board[2][2]){
                setUserWon(Board[0][0])
                
            } 
        }
        if (Board[0][2] !== ' ' && Board[1][1] !== ' ' && Board[2][0] !== ' '){
            if(Board[0][2] === Board[1][1] && Board[1][1] === Board[2][0]){
                setUserWon(Board[0][2])
                
            } 
        }

        // write draw login here <<<<<<<<<<<<<<<<<<<<<<<<<

        //if user won 
        if(UserWon){
            setBoard([[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']])
            setIsPlayed([[false,false,false],[false,false,false],[false,false,false]])
            setUserWon()
        }

    },[Board,UserWon])

    const playTurn = (event) => {
        event.preventDefault()
        let i = event.target.getAttribute('i')
        let j = event.target.getAttribute('j')
        
        // to update array on player 1 side
        let arrayRow = [...Board[i]]
        let booleanRow = [...IsPlayed[i]]
        booleanRow[j] = true
        arrayRow[j] = 'O'
        let newArrayBoard = Board
        let newBooleanArray = IsPlayed
        newBooleanArray[i] = booleanRow
        newArrayBoard[i] = arrayRow
        setBoard(newArrayBoard)
        setIsPlayed(newBooleanArray)
        setIsTurn(false)
        //emits 1players moves to the server
        socket.emit("1playTurn",{i,j,newBooleanArray})
    }


    return (
        <div>
            <div className="board">
                <button onClick={playTurn} i={0} j={0} disabled={IsPlayed[0][0] && IsTurn} className="board-box" value={Board[0][0]}>{Board[0][0]}</button>
                <button onClick={playTurn} i={0} j={1} disabled={IsPlayed[0][1] && IsTurn} className="board-box" value={Board[0][1]}>{Board[0][1]}</button>
                <button onClick={playTurn} i={0} j={2} disabled={IsPlayed[0][2] && IsTurn} className="board-box" value={Board[0][2]}>{Board[0][2]}</button>
                <button onClick={playTurn} i={1} j={0} disabled={IsPlayed[1][0] && IsTurn} className="board-box" value={Board[1][0]}>{Board[1][0]}</button>
                <button onClick={playTurn} i={1} j={1} disabled={IsPlayed[1][1] && IsTurn} className="board-box" value={Board[1][1]}>{Board[1][1]}</button>
                <button onClick={playTurn} i={1} j={2} disabled={IsPlayed[1][2] && IsTurn} className="board-box" value={Board[1][2]}>{Board[1][2]}</button>
                <button onClick={playTurn} i={2} j={0} disabled={IsPlayed[2][0] && IsTurn} className="board-box" value={Board[2][0]}>{Board[2][0]}</button>
                <button onClick={playTurn} i={2} j={1} disabled={IsPlayed[2][1] && IsTurn} className="board-box" value={Board[2][1]}>{Board[2][1]}</button>
                <button onClick={playTurn} i={2} j={2} disabled={IsPlayed[2][2] && IsTurn} className="board-box" value={Board[2][2]}>{Board[2][2]}</button>
            </div>

            <div>
                <h2 id="user-won-message">{UserWon && `${UserWon} has won the game`}</h2>
            </div>
        </div>
    )
}

export default game
