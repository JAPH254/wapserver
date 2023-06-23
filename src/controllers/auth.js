
import config from '../dbase/config.js';
import sql from 'mssql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const loginRequired=(req,res,next)=>{
    if(req.User){
        next();
    }else{
        return res.status(401).json({message:'Unauthorised user'});
    }
};

export const register =async(req, res)=>{
    const {Username, Password,Email,Role,RegistrationDate}=req.body;
    const hashedpassword=bcrypt.hashSync(Password,10);
    try {
        const userCon=await sql.connect(config.sql);
        const result =await userCon.request()
             .input("Username",sql.VarChar,Username)
             .input("Email",sql.VarChar,Email)
             .query("SELECT * FROM Users WHERE Username=@Username OR Email=@Email");
        const User=result.recordset[0];
        if (User){
            res.status(409).json({error:"Ooops. User already exists"});
        }else{
            
            await userCon.request()
                 .input("Username",sql.VarChar,Username)
                 .input("hashedpassword",sql.VarChar,hashedpassword)
                 .input("Email",sql.VarChar,Email)
                 .input ("Role",sql.VarChar,Email)
                 .input("RegistrationDate",sql.Date,RegistrationDate)
                 .query("INSERT INTO Users(Username,Password,Email,Role,RegistrationDate) VALUES(@Username,@hashedpassword,@Email,@Role,@RegistrationDate)");
                 res.status(200).send({message:"User created successfully"});
        }
        
    } catch (err) {
        res.status(500).json({error:err.message});
    }
    finally{
       sql.close();  
    }
   
};

export const login =async(req, res)=>{
    const{Email,Password}=req.body;
    let Usecon=await sql.connect(config.sql);
    const result =await Usecon.request()
    .input("Email",sql.VarChar,Email)
    .query('SELECT * FROM Users WHERE Email=@Email');
    const User=result.recordset[0];
    if (!User){
        res.status(401).json({error:'Ooops..Failed to authenticate'});
    }else{
        if(!bcrypt.compareSync(Password, User.Password)){
            res.status(401).json({error:'Wrong credentials'})
        }else{
            const token= `JWT ${jwt.sign(
                {Username:User.Username, Email:User.Email}
                ,config.jwt_secret)}`;
                res.status(200).json({Email:User.Email,Username:User.Username, token:token});
        }
    }
};