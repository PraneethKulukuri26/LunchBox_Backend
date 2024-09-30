// const nodemailer = require('nodemailer');

// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'praneethscienceprojectscodes@gmail.com',
//         pass: 'jwwo tdth nhrf icfu'
//     }
// });

// let mailOptions = {
//     from: 'praneethscienceprojectscodes@gmail.com',
//     to: '2300090274@kluniversity.in',
//     //to:'praneethkuku'
//     subject: 'Subject of your email',
//     text: 'Body of your email',
//     //html:'<p style="color:red;">Hi</p>'
// };

// transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });

const db=require("./Config/mysql_DB")
async function some() {
    const conn=await db.getConnection();
    let query="insert into testTab (id,name) values(?,?)"
    await conn.query(query,[1,"praneeth"]).then((result)=>{
        conn.release();
        if (result[0].affectedRows > 0)
          console.log("Success");
        else
          console.log("Failed");
    }).catch(err=>{
        conn.release();

        if(err.sqlState=="230000"){
            console.log("Error");
        }
    });
}

some();