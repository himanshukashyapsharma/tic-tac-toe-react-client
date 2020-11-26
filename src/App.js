import React from 'react'
import {BrowserRouter as Router,Route} from "react-router-dom"
import Game from './Components/game.js'
import Join from './Components/Join.js'

import './App.css';

function App() {
  return (
    <div className="App">
        <Router>
            <Route path="/" exact component={Join} />
            <Route path="/game" exact component={Game} />
        </Router>
    </div>
  );
}

export default App;
