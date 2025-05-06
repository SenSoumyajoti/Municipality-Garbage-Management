const express = require('express');
const http = require('http')
const { Server } = require('socket.io');
const cors = require('cors');
// const methods = require('methods');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRouter = require('./routes/user.routes');
const feedbackRouter = require('./routes/feedback.routes');
// const areaRouter = require('./routes/area.routes');
// const pathRouter = require('./routes/path.routes');
// const dustbinRouter = require('./routes/dustbin.routes');
// const driverRouter = require('./routes/driver.routes');
// const assignRouter = require('./routes/assign.routes');
// const vehicleRouter = require('./routes/vehicle.routes');
// const trackingStatusRouter = require('./routes/trackingStatus.routes');
const db = require('./configs/mongooseConnection');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const userURL = process.env.ADMIN_URL;
const driverURL = process.env.DRIVER_URL;
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            `${userURL}`,
            `${driverURL}`
        ],
        methods: ['GET', 'POST', 'DELETE'],
        credentials: true
    }
});

// io.on("connection", (socket) => {
//     const isUser = socket.handshake.query.isUser === 'true'
//     console.log("♪(^∇^*)  A new user connected with ID ", socket.id, ". Is User ? ", isUser);
//     if(isUser){
//         socket.join("UserTrackingRoom")
//     }
//     socket.on('send location', (data) => {
//         console.log("**1**" ,data.pathId)
//         if(data.pathId){
//             console.log("**2**" ,data.pathId)
//             socket.to("UserTrackingRoom").emit("receive location", {id: socket.id, pathId: data.pathId.pathId, ...data});
//         }
//     })
//     socket.on('stop location', (data) => {
//         if(data.pathId){
//             socket.to("UserTrackingRoom").emit("driver disconnected", {id: socket.id, pathId: data.pathId.pathId});
//         }
//     })
//     socket.on('status created', () => {
//         socket.to("UserTrackingRoom").emit("update statuses")
//     })
//     socket.on('disconnect', () => {
//         console.log("＞︿＜  An user disconnected of ID ", socket.id, ". Is User ? ", isUser);
//         // if(!isUser){
//         //     socket.to("UserTrackingRoom").emit("driver disconnected", {id: socket.id, pathId: data.pathId.pathId})
//         // }
//     })
// })

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            `${userURL}`,
            `${driverURL}`
        ],
        methods: ["GET", "POST", "DELETE"],
        credentials: true
    })
)

app.set("view engine", "ejs");

app.use("/user", userRouter);
app.use("/feedback", feedbackRouter);
// app.use("/area", areaRouter);
// app.use("/path", pathRouter);
// app.use("/dustbin", dustbinRouter);
// app.use("/driver", driverRouter);
// app.use("/assign", assignRouter);
// app.use("/vehicle", vehicleRouter);
// app.use("/trackingStatus", trackingStatusRouter);

app.get("/", (req, res) => {
    res.send("server is running .... ");
});

server.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT)
});