const users=[];

const addUser =({id, name, room})=>{

    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const existingUser = users.find((user)=> user.room===room && user.id===id)
    if(!name || !room) return { error: 'Username and room are required.' };
    if(existingUser) return { error: 'Username is taken.'};
    const user = {id,name,room};
    users.push(user)
   return {undefined,user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>user.id===id)
    if(index !==-1)
    {
        return users.splice(index,1)[0];
    }
}

const getUser = (id)=> {
   const ans= users.find((user)=> user.id === id)
   console.log("getUser",ans)
    return ans;
  
}

const getUsersInRoom = (room) =>{
   return users.filter((user)=> user.room ===  room)
}


module.exports = {addUser,removeUser,getUser,getUsersInRoom};