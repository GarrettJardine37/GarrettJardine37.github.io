//Useful links
//https://auth0.com/blog/how-to-implement-custom-error-responses-in-expressjs/
//https://stackoverflow.com/questions/71207726/creating-a-bank-transaction-with-express-mongo-db


const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn.js"); // This will help us connect to the database
const ObjectId = require("mongodb").ObjectId; // This helps convert the id from string to ObjectId for the _id.


// ========================================== INCREASE ACCOUNTS ====================================
//Old route: updateSavings/:email
//Update Users Savings

//API
//localhost:5000/banking/increaseSavings/bradonbarfuss@gmail.com
//{
//    "savings" : 20
//}
recordRoutes.route("/banking/increaseSavings/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };

        let newvalues = {
            $inc: { savings: req.body.savings } //increase users saving by the savings in reqest body
        };
        const result = db_connect.collection("users").updateOne(myquery, newvalues) //update the databases by new value
        console.log(result)
        console.log("Savings updated. Email: ", req.params.email, " Increase By: ", req.body.savings); //debug
        res.json(result)
    } catch (err) {
        throw err;
    }
});

//Old route name: updateChecking/:email
//Update the users checking account
recordRoutes.route("/banking/increaseChecking/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let newvalues = {
            $inc: { checking: req.body.checking }
        };
        const result = db_connect.collection("users").updateOne(myquery, newvalues)
        console.log("Checking updated. Email: ", req.params.email, " Increase By: ", req.body.checking); //debug
        res.json(result)
    } catch (err) {
        throw err;
    }
});

//Update the users investing account
recordRoutes.route("/banking/increaseInvesting/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let newvalues = {
            $inc: { investing: req.body.investing }
        };
        const result = db_connect.collection("users").updateOne(myquery, newvalues)
        console.log("investing updated. Email: ", req.params.email, " Increase By: ", req.body.investing); //debug
        res.json(result)
    } catch (err) {
        throw err;
    }
});


//====================================================== DECREASE ACCOUNTS =================================
//Old Route name: /withdrawSavings/:email
recordRoutes.route("/banking/withdrawSavings/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };

        //Check if savings is above 0
        let projection = { savings: 1 }
        emailWithSavings = await db_connect.collection("users").findOne(myquery, { projection }) //DO I NEED TO ADD A LET IN FRONT?
        if (emailWithSavings.savings - req.body.savings < 0) {
            return await res.status(400).json({ message: "Withdraw to much money" })
        }

        //Update Savings
        let newvalues = { $inc: { savings: -req.body.savings } };
        const result = db_connect.collection("users").updateOne(myquery, newvalues)
        return await res.status(200).json({ message: "It Worked" })
    } catch (err) {
        throw err;
    }
});

//Old route Name /withdrawChecking/:email
recordRoutes.route("/banking/withdrawChecking/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };

        //Check if checkings is above 0
        let projection = { checking: 1 }
        emailWithChecking = await db_connect.collection("users").findOne(myquery, { projection })
        if (emailWithChecking.checking - req.body.checking < 0) {
            return await res.status(400).json({ message: "Withdraw to much money" })
        }

        //update Checking
        let newvalues = {
            $inc: { checking: -req.body.checking }
        };
        const result = db_connect.collection("users").updateOne(myquery, newvalues)
        return await res.status(200).json({ message: "IT did it!" })
    } catch (err) {
        throw err;
    }
});

recordRoutes.route("/banking/withdrawInvesting/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };

        //Check if investing is above 0
        let projection = { investing: 1 }
        emailWithInvesting = await db_connect.collection("users").findOne(myquery, { projection })
        if (emailWithChecking.investing - req.body.investing < 0) {
            return await res.status(400).json({ message: "Withdraw to much money" })
        }

        //update investing
        let newvalues = {
            $inc: { investing: -req.body.investing }
        };
        const result = db_connect.collection("users").updateOne(myquery, newvalues)
        return await res.status(200).json({ message: "IT did it!" })
    } catch (err) {
        throw err;
    }
});

// ================================================ TRANSFERING WITHIN ACCOUNT ========================================


// === Checking to savings/investings

//Old route name /CheckingToSavings/:email

//API
//localhost:5000/banking/CheckingToSaving/bradonbarfuss@gmail.com
//{
//    "checking" : 60
//}
recordRoutes.route("/banking/CheckingToSaving/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { checking: 1, savings: 1 }

        //Check if checking is above 0
        emailWithChecking = await db_connect.collection("users").findOne(myquery, { projection })
        if (emailWithChecking.checking - req.body.checking < 0) {
            return await res.status(400).json({ message: "Withdraw to much money from checking" })
        }

        //decrease checking and increase savings
        let newvalues = {
            $inc: { checking: -req.body.checking, savings: req.body.checking }
        };

        const result = db_connect.collection("users").updateOne(myquery, newvalues)
        return await res.status(400).json({ message: "IT did it!" })
    } catch (err) {
        throw err;
    }
});


//API
//localhost:5000/banking/CheckingToInvesting/bradonbarfuss@gmail.com
//{
//    "checking" : 60
//}
recordRoutes.route("/banking/CheckingToInvesting/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { checking: 1, investing: 1 }

        //Check if checking is above 0
        emailWithChecking = await db_connect.collection("users").findOne(myquery, { projection })
        if (emailWithChecking.checking - req.body.checking < 0) {
            return await res.status(400).json({ message: "Withdraw to much money from checking" })
        }

        //decrease checking and increase investing
        let newvalues = {
            $inc: { checking: -req.body.checking, investing: req.body.checking }
        };

        const result = db_connect.collection("users").updateOne(myquery, newvalues)
        return await res.status(400).json({ message: "IT did it!" })
    } catch (err) {
        throw err;
    }
});

// === Savings to Checking/investing

//API
//localhost:5000/banking/SavingToChecking/bradonbarfuss@gmail.com//
//{
//    "savings" : 60
//}
recordRoutes.route("/banking/SavingToChecking/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { checking: 1, savings: 1 }

        emailWithSavings = await db_connect.collection("users").findOne(myquery, { projection })
        if (emailWithSavings.savings - req.body.savings < 0) {
            return await res.status(400).json({ message: "Withdraw to much money from savings" })
        }

        let newvalues = {
            $inc: { savings: -req.body.savings, checking: req.body.savings }
        };
        const result = db_connect.collection("users").updateOne(myquery, newvalues)
        return await res.status(400).json({ message: "IT did it!" })
    } catch (err) {
        throw err;
    }
});

//API
//localhost:5000/banking/SavingToInvesting/bradonbarfuss@gmail.com
//{
//    "savings" : 2
//}
recordRoutes.route("/banking/SavingToInvesting/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { savings: 1, investing: 1 }

        emailWithSavings = await db_connect.collection("users").findOne(myquery, { projection })
        if (emailWithSavings.savings - req.body.savings < 0) {
            return await res.status(400).json({ message: "Withdraw to much money from savings" })
        }

        let newvalues = {
            $inc: { savings: -req.body.savings, investing: req.body.savings }
        };
        const result = db_connect.collection("users").updateOne(myquery, newvalues)
        return await res.status(400).json({ message: "IT did it!" })
    } catch (err) {
        throw err;
    }
});

//==== Investings To savings/checking

//API
//localhost:5000/banking/InvestingToChecking/bradonbarfuss@gmail.com
//{
//    "investing" : 200
//}
recordRoutes.route("/banking/InvestingToChecking/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { investing: 1, checking: 1 }

        emailWithInvesting = await db_connect.collection("users").findOne(myquery, { projection })
        if (emailWithInvesting.investing - req.body.investing < 0) {
            return await res.status(400).json({ message: "Withdraw to much money from investing" })
        }

        let newvalues = {
            $inc: { investing: -req.body.investing, checking: req.body.investing }
        };
        const result = db_connect.collection("users").updateOne(myquery, newvalues)
        return await res.status(400).json({ message: "IT did it! investing -> checking" })
    } catch (err) {
        throw err;
    }
});

//API
//localhost:5000/banking/InvestingToSavings/bradonbarfuss@gmail.com
//{
//    "investing" : 170
//}
recordRoutes.route("/banking/InvestingToSavings/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { investing: 1, savings: 1 }

        emailWithInvesting = await db_connect.collection("users").findOne(myquery, { projection })
        if (emailWithInvesting.investing - req.body.investing < 0) {
            return await res.status(400).json({ message: "Withdraw to much money from investing" })
        }

        let newvalues = {
            $inc: { investing: -req.body.investing, savings: req.body.investing }
        };
        const result = db_connect.collection("users").updateOne(myquery, newvalues)
        return await res.status(400).json({ message: "IT did it! investing -> savings" })
    } catch (err) {
        throw err;
    }
});


// ============================================ TRANSFER BETWEEN DIFFERENT ACCOUNTS ===================================
//You have to put the verficing both accounts before you can change the values, that is why it checks for both accounts, then changes the values in each


//API
// localhost:5000/banking/CheckingToSavingExternal
//{
//    "sendingAccountNumber" : 955667,
//    "receivingAccountNumber": 426965,
//    "checking" : 1
//}
recordRoutes.route("/banking/CheckingToSavingExternal").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        //sending Query + Verification
        let querySending = { accountNumber: req.body.sendingAccountNumber };
        let projectionSending = { checking: 1 }

        let accountSending = await db_connect.collection("users").findOne(querySending, { projectionSending })
        if (!accountSending) { return res.status(400).json({ message: "Sending account not found" }); }
        if (accountSending.checking - req.body.checking < 0) { return await res.status(400).json({ message: "Withdraw to much money from checking" }) } 

        //receving Query + Verification
        queryReceiving = { accountNumber: req.body.receivingAccountNumber };
        projectionReceiving = { savings: 1 }

        accountReceiving = await db_connect.collection("users").findOne(queryReceiving, { projectionReceiving })
        if (!accountReceiving) { return res.status(400).json({ message: "Reciving account not found" }); }

        //change actual values of stuff
        let newvalueSending = { $inc: { checking: -req.body.checking } };
        db_connect.collection("users").updateOne(querySending, newvalueSending)

        let newvalueReceiving = { $inc: { savings: req.body.checking } };
        db_connect.collection("users").updateOne(queryReceiving, newvalueReceiving)


        return await res.status(400).json({ message: "External Checking -> Savings" })
    } catch (err) {
        throw err;
    }
});


//API
//localhost:5000/banking/CheckingToInvestingExternal
//{   //  "sendingAccountNumber" : 955667,
//   "receivingAccountNumber": 426965,
//   "checking" : 1
//}
recordRoutes.route("/banking/CheckingToInvestingExternal").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        //sending Query + Verification
        let querySending = { accountNumber: req.body.sendingAccountNumber };
        let projectionSending = { checking: 1 }

        let accountSending = await db_connect.collection("users").findOne(querySending, { projectionSending })
        if (!accountSending) { return res.status(400).json({ message: "Sending account not found" }); }
        if (accountSending.checking - req.body.checking < 0) { return await res.status(400).json({ message: "Withdraw to much money from checking" }) } 

        //receving Query + Verification
        queryReceiving = { accountNumber: req.body.receivingAccountNumber };
        projectionReceiving = { investing: 1 }

        accountReceiving = await db_connect.collection("users").findOne(queryReceiving, { projectionReceiving })
        if (!accountReceiving) { return res.status(400).json({ message: "Reciving account not found" }); }

        //change actual values of stuff
        let newvalueSending = { $inc: { checking: -req.body.checking } };
        db_connect.collection("users").updateOne(querySending, newvalueSending)

        let newvalueReceiving = { $inc: { investing: req.body.checking } };
        db_connect.collection("users").updateOne(queryReceiving, newvalueReceiving)


        return await res.status(400).json({ message: "External Checking -> investing" })
    } catch (err) {
        throw err;
    }
});

//======Savings -> Checking/Investing =======

//API
//localhost:5000/banking/SavingToCheckingExternal
//{
//    "sendingAccountNumber" : 955667,
//    "receivingAccountNumber": 426965,
//    "savings" : 1
//}
recordRoutes.route("/banking/SavingToCheckingExternal").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        //sending Query + Verification
        let querySending = { accountNumber: req.body.sendingAccountNumber };
        let projectionSending = { savings: 1 }

        let accountSending = await db_connect.collection("users").findOne(querySending, { projectionSending })
        if (!accountSending) { return res.status(400).json({ message: "Sending account not found" }); }
        if (accountSending.savings - req.body.savings < 0) { return await res.status(400).json({ message: "Withdraw to much money from savings" }) } 

        //receving Query + Verification
        queryReceiving = { accountNumber: req.body.receivingAccountNumber };
        projectionReceiving = { checking: 1 }

        accountReceiving = await db_connect.collection("users").findOne(queryReceiving, { projectionReceiving })
        if (!accountReceiving) { return res.status(400).json({ message: "Reciving account not found" }); }

        //change actual values of stuff
        let newvalueSending = { $inc: { savings: -req.body.savings } };
        db_connect.collection("users").updateOne(querySending, newvalueSending)

        let newvalueReceiving = { $inc: { checking: req.body.savings } };
        db_connect.collection("users").updateOne(queryReceiving, newvalueReceiving)


        return await res.status(400).json({ message: "External savings -> checking" })
    } catch (err) {
        throw err;
    }
});


//API
//localhost:5000/banking/SavingToInvestingExternal
//{
//    "sendingAccountNumber" : 955667,
//    "receivingAccountNumber": 426965,
//    "savings" : 1
//}
recordRoutes.route("/banking/SavingToInvestingExternal").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        //sending Query + Verification
        let querySending = { accountNumber: req.body.sendingAccountNumber };
        let projectionSending = { savings: 1 };

        let accountSending = await db_connect.collection("users").findOne(querySending, { projectionSending })
        if (!accountSending) { return res.status(400).json({ message: "Sending account not found" }); }
        if (accountSending.savings - req.body.savings < 0) { return await res.status(400).json({ message: "Withdraw to much money from savings" }) } 

        //receving Query + Verification
        queryReceiving = { accountNumber: req.body.receivingAccountNumber };
        projectionReceiving = { investing: 1 };

        accountReceiving = await db_connect.collection("users").findOne(queryReceiving, { projectionReceiving })
        if (!accountReceiving) { return res.status(400).json({ message: "Reciving account not found" }); }

        //change actual values of stuff
        let newvalueSending = { $inc: { savings: -req.body.savings } };
        db_connect.collection("users").updateOne(querySending, newvalueSending)

        let newvalueReceiving = { $inc: { investing: req.body.savings } };
        db_connect.collection("users").updateOne(queryReceiving, newvalueReceiving)


        return await res.status(400).json({ message: "External savings -> investing" })
    } catch (err) {
        throw err;
    }
});

//======= Investing -> checking/savings
//API
//localhost:5000/banking/InvestingToCheckingExternal
//{
//    "sendingAccountNumber" : 955667,
//    "receivingAccountNumber": 426965,
//    "investing" : 1
//}
recordRoutes.route("/banking/InvestingToCheckingExternal").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        //sending Query + Verification
        let querySending = { accountNumber: req.body.sendingAccountNumber };
        let projectionSending = { investing: 1 };

        let accountSending = await db_connect.collection("users").findOne(querySending, { projectionSending })
        if (!accountSending) { return res.status(400).json({ message: "Sending account not found" }); }
        if (accountSending.investing - req.body.investing < 0) { return await res.status(400).json({ message: "Withdraw to much money from investing" }) } 

        //receving Query + Verification
        queryReceiving = { accountNumber: req.body.receivingAccountNumber };
        projectionReceiving = { checking: 1 };

        accountReceiving = await db_connect.collection("users").findOne(queryReceiving, { projectionReceiving })
        if (!accountReceiving) { return res.status(400).json({ message: "Reciving account not found" }); }

        //change actual values of stuff
        let newvalueSending = { $inc: { investing: -req.body.investing } };
        db_connect.collection("users").updateOne(querySending, newvalueSending);

        let newvalueReceiving = { $inc: { checking: req.body.investing } };
        db_connect.collection("users").updateOne(queryReceiving, newvalueReceiving);


        return await res.status(400).json({ message: "External investing -> checking" });
    } catch (err) {
        throw err;
    }
});

//API
//localhost:5000/banking/InvestingToSavingsExternal
//{;
//    "sendingAccountNumber" : 955667,
//    "receivingAccountNumber": 426965,
//    "investing" : 1
//}
recordRoutes.route("/banking/InvestingToSavingsExternal").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        //sending Query + Verification
        let querySending = { accountNumber: req.body.sendingAccountNumber };
        let projectionSending = { investing: 1 };

        let accountSending = await db_connect.collection("users").findOne(querySending, { projectionSending })
        if (!accountSending) { return res.status(400).json({ message: "Sending account not found" }); }
        if (accountSending.investing - req.body.investing < 0) { return await res.status(400).json({ message: "Withdraw to much money from investing" }) } 

        //receving Query + Verification
        queryReceiving = { accountNumber: req.body.receivingAccountNumber };
        projectionReceiving = { savings: 1 };

        accountReceiving = await db_connect.collection("users").findOne(queryReceiving, { projectionReceiving })
        if (!accountReceiving) { return res.status(400).json({ message: "Reciving account not found" }); }

        //change actual values of stuff
        let newvalueSending = { $inc: { investing: -req.body.investing } };
        db_connect.collection("users").updateOne(querySending, newvalueSending);

        let newvalueReceiving = { $inc: { savings: req.body.investing } };
        db_connect.collection("users").updateOne(queryReceiving, newvalueReceiving);


        return await res.status(400).json({ message: "External investing -> savings" });
    } catch (err) {
        throw err;
    }
});




module.exports = recordRoutes;