const express = require("express");
const routes = express.Router();

const dbo = require("../db/conn");
const { default: Savings } = require("../../frontend/src/components/savings");

const ObjectId = require("mongodb").ObjectId;

routes.route("/session_set").post(async function (req, res) {
    try {
        console.log("In /session_set, session is: " + req.session.userId);
        let status = "";
        let db_connect = dbo.getDb();
        const user = await db_connect.collection("records").findOne({email: req.body.email});
        req.session.userId = user._id.toString();
        status = "Account found";
        console.log(status);
        // if (!req.session.userId) {
        //     req.session.userId = user._id.toString();
        //     status = "Account found";
        //     console.log(status);
        // } else {
        //     status = "session already existed";
        //     console.log(status);
        // }
        const resultObj = { status: status };
        res.json(resultObj);
    } catch (err) {
        throw err;
    }
});

routes.route("/checkings/deposit").post(async function (req, res) {
    try {
        let db_connect = dbo.getDb();
        let myquery = {_id: new ObjectId(req.session.userId)};
        let newvalues = {$inc: { checking: parseInt(req.body.amount)}};
        const result = db_connect.collection("records").updateOne(myquery, newvalues);
        res.json(result);
    } catch (err) {
        throw err;
    }
});

routes.route("/checkings/withdraw").post(async function (req, res) {
    try {
        let db_connect = dbo.getDb();
        let myquery = { _id: new ObjectId(req.session.userId), checking: {$gte :parseInt( req.body.amount)}};
        let newvalues = {$inc: { checking: -parseInt(req.body.amount)}};
        if(await db_connect.collection("records").findOne(myquery)){ 
            const result = db_connect.collection("records").updateOne(myquery, newvalues);
            res.json("Withdraw Successful!")
        } else{
            res.json("No money :(");
        }
    } catch (err) {
        throw err;
    }
});

routes.route("/savings/deposit").post(async function (req, res) {
    try {
        let db_connect = dbo.getDb();
        let myquery = {_id: new ObjectId(req.session.userId)};
        let newvalues = {$inc: { savings: parseInt(req.body.amount)}};
        const result = db_connect.collection("records").updateOne(myquery, newvalues);
        res.json(result);
    } catch (err) {
        throw err;
    }
});

routes.route("/savings/withdraw").post(async function (req, res) {
    try {
        let db_connect = dbo.getDb();
        let myquery = { _id: new ObjectId(req.session.userId), savings: {$gte :parseInt( req.body.amount)}};
        let newvalues = {$inc: { savings: -parseInt(req.body.amount)}};
        if(await db_connect.collection("records").findOne(myquery)){ 
            const result = db_connect.collection("records").updateOne(myquery, newvalues);
            res.json("Withdraw Successful!")
        } else{
            res.json("No money :(");
        }
    } catch (err) {
        throw err;
    }
});

routes.route("/session_get").get(async function (req, res) {
    console.log("In /session_get, session is: " + req.session.userId);
    let status = "";
    if (!req.session.userId) {
        status = "No session set";
        console.log(status);
    } else {
        status = "session username is: " + req.session.userId;
        console.log(status);
    }
    const resultObj = { status: status };

    res.json(resultObj);
});

routes.route("/summary").get(async function (req, res) {
    console.log("summary, session is: " + req.session.userId);
    try {

        let db_connect = dbo.getDb("users");
        let querry = {_id: new ObjectId(req.session.userId)};
        const result = await db_connect.collection("records").find(querry).project({password: 0}).toArray()
        res.json(result);

    } catch (err) {
        throw err;
    }
});

routes.route("/session_delete").get(async function (req, res) {
    console.log("In /session_delete, session is: " + req.session);
    req.session.destroy();
    
    let status = "No session set";

    const resultObj = { status: status };

    res.json(resultObj);
});

module.exports = routes;