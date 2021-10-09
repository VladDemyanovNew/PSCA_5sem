import nodemailer from "nodemailer";
import fs from "fs";
const config = JSON.parse(fs.readFileSync('./config.json'));

export default async function send (subject, text, senderName, reciever){
    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: config.mailAuth.user,
            pass: config.mailAuth.pass
        },
    }, {
        from: `${senderName} <${config.mailAuth.user}>`,
    });

    let result = transporter.sendMail({
        to: reciever,
        subject: subject,
        text: text,
        html: `<b>${text}</b>`,
    }, (err, info) => {
        if (err) return console.log(err);
        console.log('Email sent: ', info)
    });
}