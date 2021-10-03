const jwt = require('jsonwebtoken')
const moment = require('moment')

function Time(current, before) {
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
    console.log(1.0)
    const token = req.header('auth-token')
    console.log(1.1)
    if (!token) return res.status(401).send('Access Denied')
    try {
        console.log(1.2)
        const verified = jwt.verify(token, process.env.JWT_SECRET)

        req.user = verified;
        const isInTime = await Time(moment().format("YYYY/MM/DD/HH"),moment(verified.moment).format("YYYY/MM/DD/HH"))
        console.log(isInTime)
        if (isInTime) {
        console.log(1.3)
            next();
        } else{
        console.log(1.4)
            res.status(400).sent('Token Expire')
        }
    } catch (err) {
        console.log(1.5)
        res.status(400).send('Invalid Token')

    }
} 