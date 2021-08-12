const express = require('express')
const route = require('./routes');
const connectDB = require('./src/configs/connectDb');
const SocketServer =require('./serverSocket')
const app = express();
require('dotenv').config();
const Env = process.env;
const path = require('path');
const http = require('http').Server(app)
const io = require('socket.io')(http)
const cors = require('cors');

io.on('connection', socket => {
  SocketServer(socket, io)
})

//CORS Middleware
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

app.use(express.json());

//test connect db
connectDB();

//Route init
route(app);

app.use(express.static(path.join(__dirname, 'resources')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = {
      error: 404,
      message: 'not_found',
      status: 400,
      data: null
    };
    next(error);
  });
  
  // error handler
  app.use((err, req, res, next) => {
    return res.json({
      error: err.error,
      message: err.message,
      status: 400,
      data: null
    })
  });


http.listen(Env.PORT, () => {
  console.log(`Server is running on port ${Env.PORT}`)
})
