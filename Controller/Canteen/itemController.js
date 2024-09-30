  const db=require("../../Config/mysql_DB");
  const { checkIsAdmin } = require("./helper");

  async function CanteengetItems(req,res){
    try{
      const CanteenId=req.payload.CanteenId;
      ///console.log(CanteenID);

      if(!req.payload.role==='admin'){
        return res.json({code:-1,message:'Invalid Token.'});
      }

      const query='select * from FoodItem where CanteenId= ?';
      const conn=await db.getConnection();

      await conn.query(query,[CanteenId]).then(result=>{
        conn.release();
        result=result[0];

        //console.log(result);

        return res.json({
          code:1,
          message:"Items fetched Successfully",
          data:result,
        })

      }).catch((err)=>{
        conn.release();
        console.log("itemController->getItems err: "+err.message);
        return res.json({
          code:0,
          message:"Unable to fetch data."
        });
      });
    }catch(err){
      console.log("Failed to get items: "+err.message);
      return res.json({code:-1,message:"Failed to get items"});
    }
  }


  async function deleteItem(req,res) { 

    try{
      const itemId=req.query.id;
      const CanteenId=req.payload.CanteenId;
      //console.log(CanteenId);

      const conn=await db.getConnection();
      const query='delete from FoodItem where FoodItemId=? and CanteenId=?';

      await conn.query(query,[itemId,CanteenId]).then((result)=>{
        conn.release();

        if(result[0].affectedRows>0){
          return res.json({
            code:1,
            message:'Item removed.'
          });
        }else{
          return res.json({
            code:0,
            message:'Item not removed.'
          })
        }
      }).catch(err=>{
        conn.release();
        console.log(err.message);
        return res.json({
          code:0,
          message:'Unable to delete.'
        })
      });
    }catch(err){
      console.log(err.message);
      return res.json({
        code:-1,
        message:'Something wrong'
      })
    }
  }

  async function updateItem(req,res) {
    try{
      const itemId=req.query.id;
      const CanteenId=req.payload.CanteenId;
      const {Description,Price,img,Category,AvailableFrom,AvailableTo,availability,Quantity}=req.body;

      if(!Description || !Category || isNaN(Price) || isNaN(Quantity)){
        return res.json({
          code:0,message:'Invalid data.'
        });
      }



      const query='update FoodItem set Description = ? , Price = ? , img = ? , Category = ? , AvailableFrom = ? , AvailableTo = ? , availability = ? , Quantity = ? where itemId = ? and CanteenId = ?';
      const conn=await db.getConnection();
      await conn.query(query,[Description,Price,img,Category,AvailableFrom,AvailableTo,availability,Quantity,itemId,CanteenId])
      .then(result=>{
        conn.release();

        if(!(result[0].affectedRows>0)){
          return res.json({code:0,message:'Item Not Updated'});
        }

        return res.json({code:1,message:'Items Updated'});

      }).catch(err=>{
        conn.release();
        console.log(err.message);
        return res.json({code:0,message:'Failed to update'});
      });

    }catch(err){
      console.log(err.message);
      return res.json({
        code:-1,
        message:'Failed to update data.'
      })
    }
  }

  async function addItem(req,res) {

    try{
      const CanteenId=req.payload.CanteenId;

      let {FoodItemName,Description,Price,img,Category,AvailableFrom,AvailableTo,Quantity,availability}=req.body;
      if(!Description) Description="";
      if(!img) img="";
      if(!Category) Category="veg";
      if(!AvailableFrom) AvailableFrom="9:00";
      if(!AvailableTo) AvailableTo="17:30";
      if(!Quantity) Quantity=30;
      if(availability==null) availability=true;
      
      if(!FoodItemName || !Price || isNaN(Price)){
        return res.json({
          code:0,
          message:'Invalid Data'
        })
      }

      const conn=await db.getConnection();
      const query='insert into FoodItem (canteenId,FoodItemName,Description,Price,img,Category,AvailableFrom,AvailableTo,Quantity,availability) values(?,?,?,?,?,?,?,?,?,?)';

      await conn.query(query,[CanteenId,FoodItemName,Description,Price,img,Category,AvailableFrom,AvailableTo,Quantity,availability])
      .then(result=>{
        conn.release();

        if(result[0].affectedRows>0){
          return res.status(200).json({
            code:1,message:'Item added.'
          });
        }else{
          return res.status(200).json({
            code:0,message:'Item not added.'
          });
        }

      }).catch(err=>{
        conn.release();
        console.log(err.message);
        return res.json({
          code:0,
          message:'Data not added.'
        })
      });
      
    }catch(err){
      console.log(err);
      return res.json({code:-1,message:'Not able to add Item.'});
    }
    
  }


  module.exports={
    CanteengetItems,
    deleteItem,
    updateItem,
    addItem
  }