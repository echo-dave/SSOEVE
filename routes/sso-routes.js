const sso = require("../controllers/sso");
const express = require("express");
const router = express.Router();
  
  //sent to verify the character after the SSO login callback
  router.post("/api/authsso", sso.loginSSO)
  module.exports = router;