// Require Packages and Models
const express = require('express')
const fork = express.Router()
const Fork = require('../models/forkModel.js')
const jwt = require('jsonwebtoken')

// Routes

// Backend Routes
// Show Single User Data
fork.get('/savedRecipes', (req, res) => {
    console.log('req.user',req.user.userName)
    Fork.findOne({userName:req.user.userName}, (err, recipes) => {
        if (err)(res.status(400).json({ error: err.message }))
        console.log(recipes)
        res.status(200).json(recipes.recipes)
    })
})

// Show ALL Data
// fork.get('/', (req, res) => {
//     Fork.find({}, (err, recipes) => {
//         if (err)(res.status(400).json({ error: err.message }))
//         res.status(200).json({recipes})
//     })
// })

// Working Routes
// Delete Recipe
fork.delete('/delete', (req, res) => {
    Fork.findOne({userName: req.user.userName}, (err, recipes) => {
        if ( err) (res.status(400).json({ error: err.message }))
        console.log('before',recipes)
        recipes.recipes.splice(req.body.index, 1)
        console.log('after', recipes)
        console.log(recipes.recipes)
        Fork.findOneAndUpdate({ userName: req.user.userName }, { $set: { recipes: recipes.recipes } }, { new: true }, (err, recipes) => {
            console.log(recipes)
            if (err) { res.status(400).json({ error: err.message }) }
            res.status(200).json(recipes)
        })
    })
})

// Add Recipe
fork.put('/add', (req, res) => {
    Fork.findOneAndUpdate({ userName: req.user.userName }, { $push: { recipes: req.body.recipe }}, { new: true }, (err, recipes) => {
        if (err) { res.status(400).json({ error: err.message }) }
        res.status(200).json(recipes.recipes)
    })
})


// Export Router
module.exports = fork