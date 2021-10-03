require ('dotenv').config()
const {sequelize} = require('./models')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors({origin: true, credentials:true}))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use('/user',require('./router/user'))
app.use('/auth',require('./router/auth'))
app.use('/personal',require('./router/personal'))

app.listen({port: process.env.PORT}, async () => {
    console.log("Server running on port" + process.env.PORT)
    await sequelize.authenticate()
    console.log("Database Connected!")
})


