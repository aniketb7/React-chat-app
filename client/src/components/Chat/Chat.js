import React, {useState,useEffect} from 'react'
import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import './Chat.css' 
import io from 'socket.io-client';
import { InfoBar } from '../InfoBar/InfoBar';  
import { Input } from '../Input/Input';
import { Messages } from '../Messages/Messages';
import { TextContainer } from '../TextContainer/TextContainer';

let socket;

export const Chat = () => {

  const location = useLocation();
  const [name, setName]=  useState('')
  const [room, setRoom] = useState('')
  const [message,setMessage] = useState('')
  const [messages,setMessages] = useState([])
  const [users, setUsers] = useState('')
  const ENDPOINT='localhost:5000'
  
  useEffect(()=>{
    const {name, room} = queryString.parse(location.search)
    socket = io(ENDPOINT);
    setName(name);
    setRoom(room);
    socket.emit('Join', {name,room},(error)=>{
       if(error)
       {
         alert(error);
       }
       console.log("client side", name, "sent to server")
    });

    return ()=>{
      socket.disconnect()
      socket.off("Join");
    }
  },[])

  // hook for receiving msg
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
      console.log("client-side",message, messages)
    });
    
    return ()=>{
      socket.off('message')
    }
  
}, [messages]);

console.log(messages)
useEffect(()=>{
    socket.on('roomData',({room, users}, callback)=>{
      setUsers(users)
    })

  },[users])

  //function for sedning message
  const sendMessage =(event)=>{
    event.preventDefault();
    if(message) {
      socket.emit('sendMessage', message, () => {
          setMessage("")
    });
    }
  }

  
  return (
    <div className="outerContainer">
    <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
    </div>
     <TextContainer users={users}/>
  </div>
  )
}
