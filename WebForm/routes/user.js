const express = require("express")
const fs = require('node:fs')
const readline = require('readline'); 

const router = express.Router()

router.get("/", (req, res) => {
    const firstName = req.query.firstName
    const lastName = req.query.lastName
    const favouriteFood = req.query.favouriteFood
    const content = firstName + " " + lastName + ", " + favouriteFood + "\n"

    var htmlStr = "<html><head></head><body>"
    fs.appendFile('mydata.txt', content, err => {
        if (err) {
            console.error(err)
        }
    })

    const file = readline.createInterface({ 
        input: fs.createReadStream('mydata.txt'), 
        output: process.stdout, 
        terminal: false
    });
    

    
    file.on('line', (line) => {
        htmlStr += "<p>" + line + "</p>"
    });

    file.on('close', function (){
        htmlStr +="</body></html>"

        res.send(htmlStr)
    })

})

module.exports = router