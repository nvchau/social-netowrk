const nodemailer =  require('nodemailer')

const sendMail = async (email, code) =>{

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true   , // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD_MAIL, // generated ethereal password
        },
      })

    await transporter.sendMail({
        from: 'Social Media', // sender address
        to: email, // list of receivers
        subject: 'Verify your email!', // Subject line
        text: 'Verify', // plain text body
        html: `<b>${code}</b>`, // html body
      });
}

module.exports = sendMail