const mongoose = require('mongoose')
const db_live = 'mongodb+srv://abhisheksinghit95:abhishek2003@cluster0.m7yh0pv.mongodb.net/CollegePlacementSystem?retryWrites=true&w=majority&appName=Cluster0'
const local_url = 'process.env.Local_url'

const connectDb = () => {
    return mongoose.connect(db_live)
        .then(() => {
            console.log("connect Db")
        }).catch((err) => {
            console.log(err)
        })
}
module.exports = connectDb
