var logger = require('../Logger/winston').logger
var userModel = require('../Database/Model/User')
const customCode = require('../Util/CustomCode').General
const asyncMiddleware = require('../Util/asyncMiddleware').asyncMiddleware;
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var verifyToken = require('../Util/VerifyToken');
const { json } = require('body-parser');

router.put("/createUser", asyncMiddleware(async (req, res, next) => {
    logger.info("createUser :" + JSON.stringify(req.body));
    try {
        let  user = new  userModel({
            email  : req.body.email,
            password : req.body.password,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            dateOfBirth : req.body.dateOfBirth,
            enteredBy  : req.body.enteredBy,
            enteredDate  : req.body.enteredDate,
            modifiedBy  : req.body.modifiedBy,
            modifiedDate  : req.body.modifiedDate,
            isActive  : req.body.isActive,
            isDeleted  : req.body.isDeleted
        })

        if(!user.save()){
            logger.error("internal db error :" + req.email);
            return res.status(500).send({ code: customCode.internal_database_error, message: "internal_database_error!!", 'data': { email: req.body.email } })
        }

        return res.status(200).send({ code: customCode.success, message: "", 'data': { user } ,'token' : 'req.token' })

    } catch (error) {
      logger.error("internal create user error :" + error);
      return res.status(500).send({ 'code': customCode.internal_database_error, 'errorDescription': 'error occured while creating user', 'data': {} });
    }
}));

router.post("/login",asyncMiddleware(async(req,res,next) => {

    logger.info("login :" + JSON.stringify(req.body));
    try {
        

        let user =await userModel.findOne({
             email : req.body.email,
             password : req.body.password
        });

        if(!user){
            logger.error("internal db error :" + req.email);
            return res.status(500).send({ code: customCode.internal_database_error, message: "internal_database_error!!", 'data': { email: req.body.email } })
        }
        var userEmail = user.email;
        var token = jwt.sign({ id: user._id, email: user.email }, '!supersecret', {
            expiresIn: '864000' // expires in 24 hours
          });


        return res.status(200).send({ code: customCode.success, message: "", 'data': { userEmail } ,'token' : token })

    } catch (error) {
      logger.error("internal create user error :" + error);
      return res.status(500).send({ 'code': customCode.internal_database_error, 'errorDescription': 'error occured while login', 'data': {} });
    }

}));

router.get('/GetProfileData',verifyToken,asyncMiddleware(async(req,res,next) => {
    try {
        logger.info("GetProfileData called :" + JSON.stringify(req.userId));
        var user = await userModel.findOne({ _id: req.userId, isActive: true });
        if (!user)
         return res.status(404).send({ 'code': customCode.internal_database_error, 'errorDescription': 'user not found', 'data': {} });
        
         var currentDay = new Date().getDate()
         var currentMonth = new Date().getMonth() 
         var birthDay = user.dateOfBirth.getDate()
         var birthMonth = user.dateOfBirth.getMonth() 
         var BirthDayMessage = 'No BirthDay';
         let MathsigninNegative = -1;
         let BirthdayInNext7Days = 7; 

         //TODO :- add hard string and number constant. and message language in database so it can be configure language wise.
         if(currentDay === birthDay && currentMonth === birthMonth){
            BirthDayMessage = 'Happy BirthDay.'
         }
         else if(currentMonth === birthMonth){
             if(Math.sign(birthDay - currentDay) == MathsigninNegative){
                BirthDayMessage = 'BirthDay gone.'
             }
             else if((birthDay - currentDay) <= BirthdayInNext7Days){
                BirthDayMessage = birthDay - currentDay + ' Days to go.'
             }
         }
         

         
        
        

         return res.status(200).send({ 'code': customCode.success, 'errorDescription': '', 'data': { user } , 'BirthDayMessage' : BirthDayMessage });
      } catch (error) {
        logger.info("error occured while getmyprofile " + error);
        return res.status(500).send({ 'code': customCode.internal_database_error, 'errorDescription': 'error occured while getmyprofile', 'data': {} });
      }
}))


module.exports = router;