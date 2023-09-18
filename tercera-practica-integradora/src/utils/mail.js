import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: "martiniozzi103@gmail.com",
        pass: "gjlzgrkisywawvdu",
    },
    tls: {
        rejectUnauthorized: false
    }
})