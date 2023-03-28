import React from "react";
import {  
    BrowserRouter as Router,  
    Routes,  
    Route,  
    Link  
}   
from 'react-router-dom';  
import { Chat } from "./components/Chat/Chat";
import { Join } from "./components/Join/Join";

const App = ()=> (
    <Router>
        <Routes>
            <Route path="/" exact element={<Join/>}/>
            <Route path="/chat"  element={<Chat/>}/>
      </Routes>
    </Router>
)

export default App