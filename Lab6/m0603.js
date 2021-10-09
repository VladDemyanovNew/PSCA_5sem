import nodemailer from "nodemailer";
import fs from "fs";
const config = JSON.parse(fs.readFileSync('./config.json'));
console.log(config.mailAuth.user);

export default async function send (){
    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: '',
            pass: ''
        },
    }, {
        from: 'Mailer Test <vlad.demyanov.official@mail.ru>',
    });

    let result = transporter.sendMail({
        to: '',
        subject: "Hello",
        text: "Hello world?",
        html: "<b>Hello world?</b>",
    }, (err, info) => {
        if (err) return console.log(err);
        console.log('Email sent: ', info)
    });
}