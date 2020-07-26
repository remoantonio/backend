const mongoose = require('mongoose')

const forkSchema = mongoose.Schema({
    userName : { type:String, required: true, unique: true},
    password : { type:String, required: true},
    recipes : {}
})

module.exports = mongoose.model('Fork', forkSchema)