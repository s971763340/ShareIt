require('dotenv').config();
const mongoose = require('mongoose');
function connectDB() {
    // Database connection 
    mongoose.connect(process.env.mongoConnectionUrl);//the extra command used are predefined in mongodb 6.0
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('Database connected');
    }).on("error", function (e){
        console.log('Connection failed ');
    });
}

// mIAY0a6u1ByJsWWZ

module.exports = connectDB;