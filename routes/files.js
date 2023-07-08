const router = require('express').Router();

const multer = require('multer');   //for multer library

const path = require('path');  //for path

const File = require('../models/file'); //importing for another folder located at loaction

const {v4: uuid4} = require('uuid');

let storage = multer.diskStorage({
    destination :(req,file,cb)=>cb(null,'uploads/'),  //cb= callback
    filename:(req,file,cb) =>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`; //generates a random name for file using date, rand 
        // date = 9823873879 , rand = 77291956238 ,    extname = gives the extension of the original file, result=984736871456-87461487646.zip   
        cb(null, uniqueName);
         
    },
})

let upload = multer({
    storage: storage,
    limit: {fileSize: 1000000 * 100},  //1000000 bytes = 1 mb(total of 100 mb)
}).single('myfile');

router.post('/' , (req,res)=>{
    
        
    //store file in uploads
        upload(req, res, async(err)=>{

            if(!req.file){
                return req.json({error : 'all feilds are req'});
            }
            //vadidate req
            if(err){
                return res.status(500).send({error:err.message});
            }
            //store into database
            const file = new File({
                filename: req.file.filename,
                uuid: uuid4(), //unique uuid will be generated and stored
                path: req.file.path, //add destination and file & stores in path
                size: req.file.size
            });

            const response = await file.save();
            res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` }); //generating download link
            // example ==  http://localhost:3000/files/74trc76b23y23487rxny34-87439tb478ctb6r4c sending this to clint
        });
    

    //response(sending back) -> link 
})

router.post('/send',async(req,res)=>{
    const {uuid, emailto, emailfrom} = req.body;  //destructuring all the fields using req.body
    
    //validate req
    if(!uuid || !emailto ||!emailfrom){
        return res.status(422).send({error: 'all feilds are req'});
    }
    //get data from database
    const file = await File.findOne({uuid: uuid});
    if(file.sender){  // this command is used when an email is alredy sent to the sender then it will not send it
        return res.status(422).send({error: 'email alredy sent.'});

    }

    file.sender = emailfrom;
    file.receiver = emailto;
    const response = await file.save();

    //send email
    const sendmail = require('../services/emailServices');
    sendmail ({
        from: emailfrom,
        to :emailto,
        subject: 'ShareIt file sharing',
        text: `${emailfrom} shared a file with you`,
        html: require('../services/emailTemplate')({
            emailFrom: emailfrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + ' KB',
            expires: '24 Hours',
        })
    });

    return res.send({success:true});

})

module.exports=router;