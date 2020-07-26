// Require Packages and Models
const express = require('express')
const fork = express.Router()
const Fork = require('../models/forkModel.js')

// Routes

// Backend Routes
// Show Single User Data
fork.get('/:id', (req, res) => {
    Fork.findById(req.params.id, (err, recipes) => {
        if (err)(res.status(400).json({ error: err.message }))
        res.status(200).json({recipes})
    })
})

// Show ALL Data
fork.get('/', (req, res) => {
    Fork.find({}, (err, recipes) => {
        if (err)(res.status(400).json({ error: err.message }))
        res.status(200).json({recipes})
    })
})

// Working Routes
// Delete Recipe
fork.delete('/delete', (req, res) => {
    Fork.findOne({userName: req.body.userName}, (err, recipes) => {
        if ( err) (res.status(400).json({ error: err.message }))
        delete recipes.recipes[req.body.delete]
        Fork.findOneAndUpdate({ userName: req.body.userName }, {$set : {recipes: recipes.recipes}}, { new: true }, (err, recipes) => {
            if (err) { res.status(400).json({ error: err.message }) }
            res.status(200).json(recipes.recipes)
        })    
    })
})

// Add Recipe
fork.put('/add', (req, res) => {
    Fork.findOneAndUpdate({ userName: req.body.userName }, { recipes: req.body.recipes }, { new: true }, (err, recipes) => {
        if (err) { res.status(400).json({ error: err.message }) }
        res.status(200).json(recipes.recipes)
    })
})


// Export Router
module.exports = fork