const router = require('express').Router();
const File = require('../models/file');


router.get('/:uuid', async (req,res)=>{
    const file=await File.findOne({uuid: req.params.uuid}) //checks for the uuid  in database
    if(!file){
        return res.render('download',{error:'Link has been expired'});
    }
    const filePath = `${__dirname}/../${file.path}`; //tells the path
    res.download(filePath); //for downloading the file
});

module.exports = router
