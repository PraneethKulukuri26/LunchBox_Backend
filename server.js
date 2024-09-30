const express=require("express");
const helmet = require("helmet");
const dotenv=require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");

dotenv.config();

const app=express();

//Middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(compression());


const verifyToken=require("./MiddleWare/verifyUserToken");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


//admin-login
const CanteenAuthRouter=require('./router/Canteen/authRounter')
app.use('/api/Canteen/auth',CanteenAuthRouter);


//admin-items
const CanteenItemRouter=require("./router/Canteen/itemRouter")
app.use('/api/Canteen/item',verifyToken,CanteenItemRouter);



//User-auth
const UserAuthRouter=require('./router/User/authRouter');
app.use('/api/User/auth',UserAuthRouter);

//User-items
const UserItemRouer=require('./router/User/itemRouter');
app.use('/api/User/item',verifyToken,UserAuthRouter);

//explore
const ExploreRouter=require('./router/explore/exploreRouter');
app.use('/api/explore',ExploreRouter);




app.get("/test",verifyToken,(req,res)=>{
    res.json({code:17 , message: 'Hello Praneeth' , data: [
          {
            name: 'Praneeth',
            id: '23000',
            list: [9 , 9 , 9]
          }
      ]})
});
