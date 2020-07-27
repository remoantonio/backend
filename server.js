// Require Packages
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
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
            console.log('am I reaching?')
            callback(null, true)
        } else {
            console.log('am I reaching?')
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
app.use(
    session({
        secret: "secret",
        saveUninitialized: false,
        resave: true,
        rolling: true,
        cookie: {
            expires: 20 * 1000
        }
    })
);

// login authentication function and middleware
function loginCheck(req, res, next) {
    if (!req.session.currentUser) {
        // res.redirect('/fork/')
        console.log(req.session.currentUser)
        next()
    } else {
        console.log(req.session.currentUser)
        res.status(200).json(req.session.currentUser)
        next()
    }
}

// Authentication token check
function authenticateToken(req, res, next) {
    // console.log('header',req.headers)
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        // console.log('here is the data',user)
        next()
    })
}

// User Section Paths
const userRoutes = ['/fork']
app.use(userRoutes, authenticateToken)


app.use('/fork', forkController)
app.use('/user', userController)
// Test Route
app.get('/ping', (req, res) => {res.send('Pong')
})

// Get Login Route
app.get('/current', (req, res) => {res.status(200).json(req.session.currentUser)
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// Listen
app.listen(PORT, () => {
    console.log('Listening',PORT)
})