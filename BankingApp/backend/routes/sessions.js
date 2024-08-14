const express = require("express")
const routes = express.Router();

//get users email, make sure you include credticals
routes.route('/session_get_email').get(async function (req, res) {
  res.json({email: req.session.email})
});

routes.route("/session_set").get(async function (req, res){
    console.log("In /session_set, seeesion is: " + req.session.email)
    let status = ""
    if (!req.session.email){
        req.session.email = req.body.email
        status = "Session set"
    } else{
        status = "Session already exists";
        console.log(status)
    }
    const resultObj = {status: status };

    res.json(resultObj)
})

routes.route("/session_get").get(async function (req, res) {
    let status = "";
    if (!req.session.email) {
      status = "No Session set";
      return res.status(400).json({message: "No session set"})
    } else {
      status = "Session email is : " + req.session.email;
      return res.status(200).json({message: "it is set"})

      console.log(status);
    }
    const resultObj = { status: status };
  
    res.json(resultObj);
  });

routes.route("/session_delete").get(async function (req, res){
    console.log("In /session_delete, seeesion is: " + req.session)
    req.session.destroy();

    let status = "No session set"

    const resultObj = {status: status };

    res.json(resultObj)
})

module.exports = routes;