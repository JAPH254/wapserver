import express from "express";
import config from "./src/dbase/config.js";
import routes from "./src/Routes/routes.js";
import jwt from 'jsonwebtoken'


const app =express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//jwt middleware
app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], config.jwt_secret, (err, decode) => {
            if (err) req.user = undefined;
            req.User = decode;
            next();
        });
    } else {
        req.User = undefined;
        next();
    }
});


routes(app)


app.get('/', (req, res)=>{
    res.send('Now you are Here, waptech values you');


});  

app.listen(config.port,()=>{
    console.log(`Waptech server is running on ${config.url}`);
});