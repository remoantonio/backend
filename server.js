// Require Packages
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const PORT = process.env.PORT || 3003
require ('dotenv').config()

// Error / Disconnection
mongoose.connection.on('error', err => console.log(err.message + ' is Mongod not running?'))
mongoose.connection.on('disconnected', () => console.log('mongo disconnected'))
//////////////////////////NEEDS TO BE UPDATED FOR HOSTING!!!!!!!!!!!!!!!!!!!!!!!!
mongoose.connect('mongodb://remo:A12345@ds153096.mlab.com:53096/heroku_5v00vl53', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', ()=>{
    console.log('connected to mongoose...')
})

// Middleware

// Definition
const whitelist = ['http://localhost:3000', 'https://forkitfronthend.herokuapp.com/']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
const forkController = require('./controllers/forkController.js')
const userController = require('./controllers/userController.js')

// Usage
app.use(express.json())
app.use(cors())
// app.use(cors(corsOptions))
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use('/fork', forkController)
app.use('/user', userController)

// login authentication function and middleware
function loginCheck(req, res, next) {
    if (!req.session.currentUser) {
        // res.redirect('/fork/')
    } else {
        currentUser = req.session.currentUser
        next()
    }
}
// User Section Paths
const userRoutes = ['/']
app.use(userRoutes, loginCheck)

// Test Route
app.get('/', (req, res) => {res.send('Hello')
})

// Listen
app.listen(PORT, () => {
    console.log('Listening')
})