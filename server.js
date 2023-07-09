const express = require('express');//The require() function is a built-in CommonJS module function supported in Node.js that lets you include modules within your project

const app = express();//object of express will be saved in app

const cors = require('cors');

const PORT = process.env.PORT || 3000;// or||

const connectDb = require('./config/DB.js');

const path = require('path');

app.use(express.static('public'));

app.use(express.json());  //calling it because express by default does not allow json 

app.use('/files/download', require('./routes/download'));
  
connectDb();

//cors setup
const corsOptions = {
    origin:['http://localhost:3000' , 'http://127.0.0.1:3000' , 'https://fragrant-abalone-damselfly.glitch.me']  //it can be an array of addresses
}

app.use(cors(corsOptions));

//Templete engine
app.set('views', path.join(__dirname,'/views'));
app.set('view engine', 'ejs');
//routes
app.use('/api/files',require('./routes/files'));//it will send file to files.js in routes folder
app.use('/files',require('./routes/show'));

app.listen(PORT, ()=>{
    console.log(PORT);
})