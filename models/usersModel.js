const mysqlPool = require('../db/dbconfig');
const credentials = require('../config/credentials')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


let getUserByEmail = async (email) => {
    try {
        const [row] = await mysqlPool.query(`SELECT email FROM users WHERE email=?`, [email]);
        if (!row.length) {
            return {
                status: "DATA_NOT_FOUND",
                data: null
            }
        }
        return {
            status: "SUCCESS",
            data: row
        }
    } catch (err) {
        console.log("Getting Error : ", err);
    }
};

let registerUser = async (data) => {
    try {
        console.log(saltRounds,data)
        let genSalt = await bcrypt.genSalt(saltRounds);
        let hash = await bcrypt.hash(data.password, genSalt);
        data.password = hash;
        // await mysqlPool.query(`INSERT INTO users(user_name , first_name , last_name , email , password) VALUES(?,?,?,?,?)`,[data.user_name,data.first_name,data.])
        await mysqlPool.query(`INSERT INTO users SET ?`, [data]);
        return {
            status: "SUCCESS",
            data: null
        }
    } catch (err) {
        console.log("Getting Error:", err);
        return {
            status: "ERROR",
            data: null
        }
    }
};

let verifyUser = async (data) => {
    let user_data = await getUserByEmail(data.email);
    if (user_data.status == "SUCCESS") {
        let isValidPassword = await bcrypt.compareSync(data.password, user_data.data.password);
        if (isValidPassword) {
            let token = jwt.sign({
                id: user_data.data.id,
                user_name: user_data.data.user_name,
                email: user_data.data.email,
            }, credentials.SECRET);

            let data = {
                id: user_data.data.id,
                user_name: user_data.data.user_name,
                token: token,
                user_name: user_data.data.id,
                email: user_data.data.email
            };
            return {
                status: "SUCCESS",
                data: data
            }
        }
        return {
            status: "ACCESS DENIED",
            data: null
        }
    }
    return {
        status:"Try Again !",
        data:null
    }

};


module.exports = {
    getUserByEmail,
    registerUser,
    verifyUser
};