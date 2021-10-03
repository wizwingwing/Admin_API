const jwt = require('jsonwebtoken')
const moment = require('moment')

function time(current, before) {
    const [yearB,monthB,dayB,hourB] = before.split("/")
    const [yearC,monthC,dayC,hourC] = current.split("/")

    const year = yearC-yearB
    const month = monthC-monthB
    const day = dayC-dayB
    const hour = hourC-hourB

    if(year > 0 || month > 0 || day > 0 || hour > 0 ){
        return false
    } else if (day >=1 && hour > 0){
        return false
    } else{
        return true
    }
}

module.exports = async function auth (req, res, next) {

    const token = req.header('auth-token')

    if (!token)
        return res.status(401).send('Access Denied')
    try {

        console.log(token, process.env.JWT_SECRET)

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        console.log(verified)

        req.user = verified
        const isInTime = await Time(moment().format("YYYY/MM/DD/HH"), moment(verified.moment).format("YYYY/MM/DD/HH"))
        
        if (isInTime) {
            next();
        } else{
            res.status(400).sent('Token Expire')
        }
    } catch (err) {
        res.status(400).sent('Token Expire')
    }
} 