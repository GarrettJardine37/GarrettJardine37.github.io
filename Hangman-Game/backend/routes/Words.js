const express = require("express");
const session = require('express-session');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn.js");

// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


recordRoutes.route("/words/getRandomWord").get(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let query = { $sample: { size: 1 } }


    let word = await db_connect.collection('words').aggregate([{ $sample: { size: 1 } }]).toArray()

    console.log(word[0].word)

    res.json(word[0].word)
  } catch (err) {
    throw err;
  }
})

recordRoutes.post('/words/setName', (req, res) => {
  const { playerName } = req.body;
  req.session.name = playerName;
  res.json({ message: 'name set' });
});

// USED TO POPULATE THE DATABASE. ONLY USED ONCE
// recordRoutes.route("/words/insertWords").get(async (req, res) => {
//   try {
//     let db_connect = dbo.getDb();
//     const apiUrl = 'https://random-word-api.herokuapp.com/word?number=1000';
//     words = [];
//     let wordsget= await fetch(apiUrl)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(data => {
//       words = data;
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
//     words.forEach(item => {
//       db_connect.collection("words").insertOne({word: item});
//     });
//     //db_connect.collection("words").insertMany(wordList)
//     console.log("inserted stuff")

//   } catch (err) {
//     throw err;
//   }
// })




module.exports = recordRoutes;