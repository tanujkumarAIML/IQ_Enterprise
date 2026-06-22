module.exports=(io)=>{

io.on("connection",(socket)=>{

console.log(

"Socket Connected",

socket.id

);

socket.on(

"joinInterview",

(data)=>{

socket.join(data.room);

}

);

socket.on(

"answer",

(data)=>{

socket.to(data.room).emit(

"answer",

data

);

}

);

socket.on(

"disconnect",()=>{

console.log(

"Disconnected",

socket.id

);

});

});

};