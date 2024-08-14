//myProject / server / routes / record.js
const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

function validateFeilds(fName, lName, email, pNum, pass) {
    if (fName != "" && lName != "" && email != "" && pNum != "" && pass != ""){
        return true
    }
    return false;
  }

// This section will help you create a new record.
recordRoutes.route("/record/add").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myobj = {
            first_Name: req.body.first_Name,
            last_Name: req.body.last_Name,
            email: req.body.email,
            phone_Number: req.body.phone_Number,
            password: req.body.password,
            role: null,
            savings: 0,
            checking: 0,
        };
        if(validateFeilds(myobj.first_Name , myobj.last_Name, myobj.email, myobj.phone_Number, myobj.password)){
            if(!await db_connect.collection("records").findOne({email: req.body.email})){
                const result = await db_connect.collection("records").insertOne(myobj);
                res.json(result);
            }
            else{
                console.log("Email already in use")
                res.json(null);
            }
        }
        else{
            console.log("please fill all of the feilds")
            res.json(null);
        }
    } catch (err) {
        throw err;
    }
});

// email password querry bs
recordRoutes.route("/record/signIn").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { 
            email: req.body.email,
            password: req.body.password
        };
        if (await db_connect.collection("records").findOne(myquery)){
            res.json("Account found!");
        }
        else{
            res.json("Inccorrect username or password :(");
        }
    } catch (err) {
        throw err;
    }
});

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb("users");
        const result = await db_connect.collection("records").find({}).project({password: 0}).toArray();
        res.json(result);
    } catch (err) {
        throw err;
    }
});

// This section will help you get a record based on email.
recordRoutes.route("/record/:id").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb("users");
        let querry = {_id: new ObjectId(req.params.id)};
        const result = await db_connect.collection("records").find(querry);
        res.json(result);
    } catch (err) {
        throw err;
    }
});


// This section will help you update a role by email.
recordRoutes.route("/update/:id").put(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { _id: new ObjectId(req.params.id) };
        let newvalues = {
            $set: {
                first_Name: req.body.first_Name,
                last_Name: req.body.last_Name,
                email: req.body.email,
                phone_Number: req.body.phone_Number,
                password: req.body.password,
            },
        };
        const result = db_connect.collection("records").updateOne(myquery, newvalues);
        res.json(result);
    } catch (err) {
        throw err;
    }
});

//deposit savings by email
recordRoutes.route("/deposit/savings/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let newvalues = {$inc: {savings: req.body.amount}};
        const result = db_connect.collection("records").updateOne(myquery, newvalues);
        res.json(result);
    } catch (err) {
        throw err;
    }
});

//deposit checkings by email
recordRoutes.route("/deposit/checking/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let newvalues = {$inc: { checking: req.body.amount}};
        const result = db_connect.collection("records").updateOne(myquery, newvalues);
        res.json(result);
    } catch (err) {
        throw err;
    }
});

//withdraw savings by email
recordRoutes.route("/withdraw/savings/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email, savings: {$gte : req.body.amount}};
        let newvalues = {$inc: {savings: -req.body.amount}};
        if(await db_connect.collection("records").findOne(myquery)){
            const result = db_connect.collection("records").updateOne(myquery, newvalues)
            res.json("Withdraw Successful!")
        }else{
            res.json("No money :(");
        }
    } catch (err) {
        throw err;
    }
});

//withdraw checkings by email
recordRoutes.route("/withdraw/checking/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email, checking: {$gte : req.body.amount}};
        let newvalues = {$inc: { checking: -req.body.amount}};
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

//transfer savings by email
recordRoutes.route("/transfer/savings/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email, savings: {$gte : req.body.amount}};
        let newvalues = {$inc: {savings: -req.body.amount, checking: req.body.amount}};
        if(await db_connect.collection("records").findOne(myquery)){
            const result = db_connect.collection("records").updateOne(myquery, newvalues);
            res.json("Transfer Successful!")
        } else{
            res.json("No money :(");
        }
    } catch (err) {
        throw err;
    }
});

//transefer checkings by email
recordRoutes.route("/transfer/checking/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email, checking: {$gte : req.body.amount}};
        let newvalues = {$inc: { checking: -req.body.amount, savings: req.body.amount}};
        if(await db_connect.collection("records").findOne(myquery)){ 
            const result = db_connect.collection("records").updateOne(myquery, newvalues);
            res.json("Transfer Successful!")
        } else{
            res.json("No money :(");
        }
    } catch (err) {
        throw err;
    }
});


module.exports = recordRoutes;