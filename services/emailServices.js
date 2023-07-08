const nodemailer = require('nodemailer'); 
async function sendMail ({from, to, subject , text, html}){
    let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
    });

    let info = await transporter.sendMail({
        from: `ShareIt<${from}>`  ,        //sending back all the info which is received 
        to,            //written like this because the both feilds are same like => from: from, = from,
        subject,
        text,
        html
    })
}

module.exports = sendMail;