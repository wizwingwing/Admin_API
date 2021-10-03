const router = require('express').Router()
const { query } = require('express')
const verify = require('../middleware/verify')

router.get('/', (req,res) =>{
    console.log(req,query)
    res.json({personal:'Employee New'})
})

module.exports = router