const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const makeid = require("../middleware/randomString");
const router = require('express').Router()
const moment = require('moment')
const { user } = require('../models')

// Register
    router.post('/register',async (req,res) => {
        try {
            const body = req.body
            console.log(body)
            const duplicate = await user.findOne({ where:{username: body.username} })

            if(duplicate){
                res.json({msg: "Duplicate Username"})
            } else {
                body.refetchToken = await makeid(10)
                const salt = bcrypt.genSaltSync(10)
                body.password = bcrypt.hashSync(body.password,salt)
                await user.create(body)

                const isUser = await user.findOne({where:{username:body.username}, raw:true})
                const token = jwt.sign({
                    id: isUser.id, 
                    username: isUser.username, 
                    moment: moment(), refetchToken:body,
                    refetchToken: body.refetchToken
                },process.env.JWT_SECRET)

                res.header("auth-token", token).json({accessToken: token, refetchToken: body.refetchToken})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Server isn't connected"})
        }
    })
// Register

// ?Login
    router.post('/login',async (req,res) =>{
        try {
            const {username,password} = req.body
            const client =await user.findOne({ where:{ username }, raw:true})

            if (!client) {
                res.json({msg: "Username Login Failed"})
            } else {
                const validPass= await bcrypt.compareSync(password, client.password)
                if (!validPass) {
                    return re.send({msg: "Invalid Password"})
                } else {
                    const refetchToken = await makeid(10)
                    await user.update({refetchToken}, {where:{ username }, raw: true})
                    const isUser = await user.findOne({where:{ username }, raw: true})
                    console.log(isUser)
                    const token = jwt.sign({
                        id: isUser.id, 
                        username: isUser.username, 
                        moment: moment(), 
                        refetchToken
                    }, process.env.JWT_SECRET)

                res.header("auth-token", token).json({ accessToken: token, refetchToken });
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Server isn't connected"})
        }
    })
// ?Login

// Todo: Retch Token
    router.post('/refetchToken',async (req,res) => {
        try {
            const {username,refetchToken} =req.body
            const isUser = await user.findOne({where:{username, refetchToken}, row:true})

            if (isUser) {
                const token = jwt.sign({
                    id: isUser.id, 
                    username: isUser.username, 
                    moment: moment(), 
                    refetchToken
                },process.env.JWT_SECRET)

                res.header("auth-token", token).json({ accessToken: token})

            } else {
                res.status(401).json({msg:"Refetch Token isn't used"})
            }
        } catch (error) {
            res.status(500).json({msg:"Server isn't connected"})
        }
    })
// Todo: Retch Token

module.exports = router