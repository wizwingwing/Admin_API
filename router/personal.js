const router = require('express').Router()
const verify = require('../middleware/verify')

router.get('/',verify, async (req,res) =>{
    console.log(1)
    res.json({personal:'Employee New'})
})

module.exports = router