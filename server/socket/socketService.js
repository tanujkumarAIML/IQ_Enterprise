const socketIO=require("socket.io");

let io;

const initializeSocket=(server)=>{

io=socketIO(server,{

cors:{

origin:"http://localhost:5173",

credentials:true

}

});

return io;

};

const getIO=()=>io;

module.exports={

initializeSocket,

getIO

};