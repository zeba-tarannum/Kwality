require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const app = express();
const router = express.Router();
const {MongoClient} = require('mongodb');

const uri = `mongodb+srv://zeba:${process.env.mongo}@cluster0.a5a3l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
// const client = new MongoClient(uri);
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

router.get("/zeba",async(req,res)=>{
  res.send("Hello Zeba")
})

router.post("/details",async (req, res)=>{
    console.log(req.body)

      const client = new MongoClient(uri);
    async function run() {
        try {
         await client.connect();
        
          // const database = client.db("cust_orders");
          // const order_data = database.collection("orders");
          // create a document to be inserted
          

          const doc = { name: req.body.name, email: req.body.email,address1:req.body.add1,address2:req.body.add2,phone:req.body.phone,
        city:req.body.city,state:req.body.state ,country:req.body.country,pincode:req.body.pincode,amount:req.body.amount,orderId:req.body.id,order:req.body.order};
          // const result = await order_data.insertOne(doc);
          const result = await client.db("cust_orders").collection("orders").insertOne(doc);
          if(result.insertedCount){
            res.json({
              msg: "success"
            })
          }
          console.log(
            `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
          );
        } finally {
          await client.close();
        }
      }
     run().catch(console.dir)
     

} 
  
  )

// const crypto = require('crypto')
router.get("/get", async (req, res) => {
  res.send("hi There")
})

router.post("/orders", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });
console.log(req,"request...",req.body.amount)
        const options = {
            amount: req.body.amount, // amount in smallest currency unit
            currency: "INR",
            receipt: "receipt_order_74394",
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post("/success", async (req, res) => {
    console.log(req,"request",req.body)
    // try {
    //     // getting the details back from our font-end
    //     const {
    //         orderCreationId,
    //         razorpayPaymentId,
    //         razorpayOrderId,
    //         razorpaySignature,
    //     } = req.body;

 const orderCreationId='order_HRlO7xP6Pr4NYs';
 const razorpayPaymentId='pay_HRlONT2cVygHoA';
 const razorpayOrderId='order_HRlO7xP6Pr4NYs';
 const razorpaySignature='a5f6a1567cbb607d18b21f0b0893e4d24c9c96a9c56e59a6a869aef322fb6d7e';
        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");
        console.log("digest",digest,"razorpaysig",razorpaySignature)
        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    
   // }
    //  catch (error) {
    //     res.status(500).send(error);
    // }
});

module.exports = router ;