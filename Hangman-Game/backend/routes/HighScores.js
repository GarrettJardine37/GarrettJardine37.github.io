const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn.js");

// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/highscore/addHighScore").post(async (req, res) => {
    try {
      let db_connect = dbo.getDb();
  
      let myobj = {
        name: req.body.name,
        guesses: req.body.guesses,
        wordLength: req.body.wordLength
      }
      const results = await db_connect.collection("highScore").insertOne(myobj)
      console.log("Hello There")
      res.json(results)
    } catch (err) {
      throw err;
    }
})

//https://www.mongodb.com/developer/products/mongodb/introduction-aggregation-framework/
recordRoutes.route("/highscore/getHighScores/:wordLength").get(async (req, res) => {
try {
    let db_connect = dbo.getDb();
    let wordLength = parseInt(req.params.wordLength)
    console.log(wordLength)
    let projection = { name: 1, guesses: 1, wordLength: 1 };//https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/read-operations/project/
    console.log(projection)
    const highscores = await db_connect.collection("highScore").aggregate([
      {
        "$match": {
          "wordLength": wordLength
        }
      },
      {
        "$sort":{
          "guesses": 1
        }
      },
      {
        "$limit": 10
      },
      {
        "$project": projection
      }
    ]).toArray()
    console.log(highscores)
    res.json(highscores)
}

catch (err) {
    throw err;
}
})

module.exports = recordRoutes;