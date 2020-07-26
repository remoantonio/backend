// Require Packages
const express = require('express')
const user = express.Router();
const bcrypt = require('bcrypt');

// Model
const Fork = require('../models/forkModel.js')

// Routes

// Get Current Username
user.get('/', (req, res) => {
    if(req.session.currentUser) {
        res.status(200).json(req.session.currentUser)
    } else {
        res.status(200).json('')
    }
})

// Logout User
user.delete('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({message: 'User Logged Out.'})
})

// Delete User
user.delete('/delete', (req, res) => {
    Fork.findOne({ userName: req.body.userName }, (err, user) => {
        if (err) { res.status(400).json({ error: err.message }) }
        if (bcrypt.compareSync(req.body.password, user.password)) {
            Fork.findOneAndRemove({ userName: req.body.userName }, (err, user) => {
                if (err) { res.status(400).json({ error: err.message }) }
                res.status(200).json({ message: 'User Deleted' })
            })
        } else {
            res.status(400).json({ message: 'Invalid password' })
        }
    })
})

// Login User
user.post('/login', (req, res) => {
    Fork.findOne({ userName: req.body.userName }, (err, user) => {
        if (err) { res.status(400).json({ error: err.message }) }
        console.log(user)
        if (!user) {
            res.status(400).json({message: 'User not found.'})
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.status(200).json([user.userName, user.recipes])
            } else {
                res.status(400).json({message: 'Invalid password'})
            }
        }
    })
})

// Create User no password return
user.post('/new', (req, res) => {
    Fork.findOne({ userName: req.body.userName }, (err, user) => {
        if (err) { res.status(400).json({ error: err.message }) }
        if (user == null) {
            if (req.body.password == req.body.password2) {
                req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
                delete req.body.password2
                Fork.create(req.body, (err, user) => {
                    if (err) {
                        res.status(400).json({ error: err.message })
                    } else {
                        req.session.currentUser = user
                        res.status(200).json(user.userName)
                    }
                })
            } else {
                res.status(400).json({'message' : 'Passwords do not match.'})
            }
        } else {
            res.status(400).json({ 'message' : 'User Name is not available.'})
        }
    })
})

// Create User returning password
user.post('/new', (req, res) => {
    Fork.findOne({ userName: req.body.userName }, (err, user) => {
        if (err) { res.status(400).json({ error: err.message }) }
        if (user == null) {
            if (req.body.password == req.body.password2) {
                req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
                delete req.body.password2
                Fork.create(req.body, (err, user) => {
                    if (err) {
                        res.status(400).json({ error: err.message })
                    } else {
                        req.session.currentUser = user
                        res.status(200).json({user})
                    }
                })
            } else {
                res.status(400).json({'message' : 'Passwords do not match.'})
            }
        } else {
            res.status(400).json({ 'message' : 'User Name is not available.'})
        }
    })
})


// Export Router
module.exports = user