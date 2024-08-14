const express = require("express")
const fs = require('node:fs')
const readline = require('readline'); 

const router = express.Router()

router.get("/", (req, res) => {
    const favouriteFood = req.query.favouriteFood
    var htmlStr = "<html><head></head><body>"

    const file = readline.createInterface({ 
        input: fs.createReadStream('mydata.txt'), 
        output: process.stdout, 
        terminal: false
    });

    file.on('line', (line) => {
        var curName = ""
        var curFood = ""
        var i = 0
        while(line[i] != ','){
            curName += line[i]
            i++
        }
        i +=2
        while(i < line.length){
            curFood += line[i]
            i++
        }

        if(curFood.toUpperCase() === favouriteFood.toUpperCase()){
            htmlStr += "<p>" + curName + "</p>"
        }
    })

    file.on('close', function (){
        htmlStr += "</body></html>"

        res.send(htmlStr)
    })

})

module.exports = router