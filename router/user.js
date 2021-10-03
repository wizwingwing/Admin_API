const router = require('express').Router()

router.get('/', async (req,res) => {
    console.log(req.query)
    res.json({msg: "Pull Data Success"})
})

router.post('/create', async (req,res)=>{
    console.log(req.body)
    res.json({msg: "Create Data Success"})
})

router.put('/update', async (req,res)=>{
    console.log(req.body)
    res.json({msg: "Update Data Success"})
})

router.delete('/delete', async (req,res)=>{
    console.log(req.query)
    res.json({msg: "Delete Data Success"})
})

module.exports = router