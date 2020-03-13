const express =require('express');
const Joi = require('@hapi/joi');
let router=express.Router();
let userModel=require('../../models/usersModel');
router.get("/",(req,res)=>{
    res.send("welcome");
});

router.post('/login',async(req,res)=>{
    try{
        let error_message='';
        const schema =Joi.object({
            email:Joi.string().required(),
            password:Joi.string().required()
        });
       // validating inputs
        try {
        await schema.validateAsync(req.body, {
            abortEarly: true
        });
        }
        catch (error) {
        console.log(error);
        error_message = error.details[0].message;
        } 
        if(error_message==""){
            let userDetails = await userModel.verifyUser({"email":req.body.email,"password":req.body.password});
            if(userDetails.status=="SUCCESS"){
                return req.send({"status":"SUCCESS IN LOGIN"})
            }else{
                return req.send({"status":"GETTING ERROR IN LOGIN"})
            }
        }
    }catch(err){
        console.log(err)
    }
});

router.post('/register', async(req,res)=>{
    let current_date = new Date();
    const schema = Joi.object({
        user_name: Joi.string().required(),
        first_name:Joi.string().required(),
        last_name:Joi.string().required(),
        email:Joi.string().required(),
        password:Joi.string().required().min(6).max(16),
        confirm_password: Joi.any().valid(Joi.ref('password')).required()
    }).with('password', 'confirm_password');

    try {
        await schema.validateAsync(req.body, {
          abortEarly: true
        });
      } catch (error) {
        console.log(error);
        let msg = error.details[0].message;
        if (msg.indexOf('[ref:password]')) {
          msg = "Password and Confirm password must be same!";
        }
        return res.send({
            status:"",
            data:msg
        });
      }
     // Check if this user already exisits 
     let user = await userModel.getUserByEmail(req.body.email);
     console.log("user",user)
     if(user.data){
        return res.status(400).send('That user already exisits!');
     }else{
        let data={
            user_name:req.body.user_name,
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            email:req.body.email,
            password:req.body.confirm_password,
            registration_date:current_date
        }
        let saveUser= await userModel.registerUser(data);
        console.log("saveuser",saveUser)
        if(saveUser.status=="SUCCESS"){
            res.send("User successfully saved.")
        }else { 
            res.send("Getting Error")
        }
      
     }
 
});

module.exports=router;