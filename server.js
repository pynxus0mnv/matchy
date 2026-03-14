const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)

app.use(express.static("public"))

let waitingUsers = []

io.on("connection",(socket)=>{

socket.on("start",(data)=>{

const user={
id:socket.id,
gender:data.gender,
match:data.match
}

let partner = waitingUsers.find(u =>
(u.match==="both" || u.match===user.gender) &&
(user.match==="both" || user.match===u.gender)
)

if(partner){

socket.join(partner.id)
io.to(partner.id).emit("matched")

waitingUsers = waitingUsers.filter(u=>u.id!==partner.id)

}else{
waitingUsers.push(user)
}

})

socket.on("msg",(msg)=>{
socket.broadcast.emit("msg",msg)
})

socket.on("disconnect",()=>{
waitingUsers = waitingUsers.filter(u => u.id !== socket.id)
})

})

http.listen(process.env.PORT || 3000)
