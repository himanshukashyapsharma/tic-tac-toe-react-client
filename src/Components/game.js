import React,{useState, useEffect} from 'react'
import io from "socket.io-client";
import queryString from "query-string";
import "./game.css"

let socket

// 0 is for 'null' on not played, 1 is for '0' and 2 is for 'x'
//i is row and j is column


function game({location,history}) {

    const [Board,setBoard] = new useState([[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']])
    const [IsPlayed,setIsPlayed] = new useState([[false,false,false],[false,false,false],[false,false,false]])
    const [RoomData,setRoomData] = new useState() // use this to implement user names
    const [UserWon, setUserWon] = new useState()
    const [IsTurn,setIsTurn] = new useState(true)
    const [ErrorMessage,setErrorMessage] = new useState(' ')
    const ENDPOINT = "http://localhost:5000/"

    new useEffect(()=>{
        const {name,room} = queryString.parse(location.search)

        // sends connection request to the ENDPOINT server
        socket = io(ENDPOINT)
        //send join message to server side while comonent loads
        socket.emit("join",{name,room})
        //sends disconnect message to server when component reloads or unloads
        
        socket.once('userData',({users}) => {
            setRoomData(users)
        })

        socket.once('no-second-user',(errorMessage) => {
            setErrorMessage(errorMessage)
        })

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

        socket.once("message",({errorMessage}) => {
            history.push('/') 
            alert(`${errorMessage}`)
        })

        socket.once('userData',({users}) => {
            setRoomData(users)
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
        } else if (Board[0][2] !== ' ' && Board[1][1] !== ' ' && Board[2][0] !== ' '){
            if(Board[0][2] === Board[1][1] && Board[1][1] === Board[2][0]){
                setUserWon(Board[0][2])              
            } 
        } 

        //if user won 
        if(UserWon){
            let winnerName = UserWon
            setBoard([[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']])
            setIsPlayed([[false,false,false],[false,false,false],[false,false,false]])
            setUserWon(null)
            setIsTurn(true)
            setRoomData(null)
            alert(`${winnerName} has won the game.`)
            history.push('/')
        }

        //draw logic
        // let drawFlag // 1 = draw , 0 = not draw
        // for(let i=0;i<3;i++){
        //     for(let j=0;i<3;j++){
        //         if(Board[i][j] === ' '){
        //             drawFlag = 0 
        //         }
        //     }
        // }
        
        // if(drawFlag && drawFlag !== 0){
        //     setBoard([[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']])
        //     setIsPlayed([[false,false,false],[false,false,false],[false,false,false]])
        //     setUserWon(null)
        //     setIsTurn(true)
        //     alert(`Draw Match`)
        //     history.push('/')
        // }

    },[Board,UserWon])

    const playTurn = (event) => {
        event.preventDefault()
        let i = event.target.getAttribute('i')
        let j = event.target.getAttribute('j')
        
        // to update array on player 1 side
        let arrayRow = [...Board[i]]
        let booleanRow = [...IsPlayed[i]]
        let newArrayBoard = Board
        let newBooleanArray = IsPlayed
        if(arrayRow[j] === ' ') {
            arrayRow[j] = 'O'
            booleanRow[j] = true
            newBooleanArray[i] = booleanRow
            newArrayBoard[i] = arrayRow
            setIsTurn(false)
            setBoard([...newArrayBoard])
            setIsPlayed([...newBooleanArray])
        }
        
        //emits 1players moves to the server
        socket.emit("1playTurn",{i,j,newBooleanArray})
        console.log('Board:',Board)
        console.log('Turn:',IsPlayed)
    }

    const isDisabled = (i,j) => {
        if(IsTurn){
            if(!IsPlayed[i][j]){
                return false
            } else {
                return true
            }
        } else {
            return true
        }
    }


    return (
        <div className="game-outer-container">
            <div className="side-nav">
                    <h1 id="players-heading">Players</h1>
                    {RoomData && RoomData.map(user => 
                            <h3>{user.name}</h3>
                        )
                    }
            </div>
            
            <div className="game-container">
                <div className="board">
                    <button onClick={playTurn} i={0} j={0} disabled={isDisabled(0,0)} className="board-box" value={Board[0][0]}>{Board[0][0]}</button>
                    <button onClick={playTurn} i={0} j={1} disabled={isDisabled(0,1)} className="board-box" value={Board[0][1]}>{Board[0][1]}</button>
                    <button onClick={playTurn} i={0} j={2} disabled={isDisabled(0,2)} className="board-box" value={Board[0][2]}>{Board[0][2]}</button>
                    <button onClick={playTurn} i={1} j={0} disabled={isDisabled(1,0)} className="board-box" value={Board[1][0]}>{Board[1][0]}</button>
                    <button onClick={playTurn} i={1} j={1} disabled={isDisabled(1,1)} className="board-box" value={Board[1][1]}>{Board[1][1]}</button>
                    <button onClick={playTurn} i={1} j={2} disabled={isDisabled(1,2)} className="board-box" value={Board[1][2]}>{Board[1][2]}</button>
                    <button onClick={playTurn} i={2} j={0} disabled={isDisabled(2,0)} className="board-box" value={Board[2][0]}>{Board[2][0]}</button>
                    <button onClick={playTurn} i={2} j={1} disabled={isDisabled(2,1)} className="board-box" value={Board[2][1]}>{Board[2][1]}</button>
                    <button onClick={playTurn} i={2} j={2} disabled={isDisabled(2,2)} className="board-box" value={Board[2][2]}>{Board[2][2]}</button>
                </div>

                <div>
                    <h2 id="turn">{IsTurn ? 'Your turn' : 'Opponents turn'}</h2>
                    <h2 id="user-won-message">{UserWon && `${UserWon} has won the game`}</h2>
                    <h2 id="error-message">{ErrorMessage && `${ErrorMessage}`}</h2>
                </div>
            </div>
        </div>
    )
}

export default game
