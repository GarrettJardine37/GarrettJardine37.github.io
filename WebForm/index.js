const express = require('express')
const myCustomRoutes = require('./routes/user')
const searchRoute = require('./routes/search')

// Load express
const app = express()
const port = 3000

//Routes folder path
app.use("/user_routes", myCustomRoutes)
app.use("/search_routes", searchRoute)

//makes bootstrap easier to add to html pages
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));


//Route paths
app.get("/", (req, res) => {
    res.send("Welome, go to userinput to start adding data")
})

app.use(express.static('public'))

app.listen(port, () => {
    console.log("Server started on port " + port)
})
