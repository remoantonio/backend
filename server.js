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
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', ()=>{
    console.log('connected to mongoose...')
})

// Middleware

// Definition

const allowList = process.env.CORS_ALLOW_LIST.split(';')
const corsOptions = {
    origin: function (origin, callback) {
        if (allowList.indexOf(origin) !== -1) {
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
// app.use(cors())
app.use(cors(corsOptions))
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
// app.use(userRoutes, loginCheck)

// Test Route
app.get('/ping', (req, res) => {res.send('Pong')
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// Listen
app.listen(PORT, () => {
    console.log('Listening')
})