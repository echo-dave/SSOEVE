const db = require("../models");
const qs = require("qs");
const axios = require("axios");
import sso from "../controllers/sso";

module.exports = function (app) {
  //sent for initial SSO login request
  app.get("/api/sso", function (req, res) {
    res.json({CLIENTID:process.env.CLIENTID, ESI:process.env.ESI, CALLBACKURL:process.env.CALLBACKURL, STATE:process.env.STATE});
    });
  
  //sent to verify the character after the SSO login callback
  app.post("/api/authsso", sso.loginSSO)

  app.get("/api/refresh/:charID", async (req, res) => {
    console.log("params: " + req.params + " query: " + req.query);
    db.Pilot.findOne({ id: req.params.charID })
      .select("id refreshToken -_id")
      .then(pilot => {
        console.log("doc: \n", pilot);
        let key = Buffer.from(
          `${process.env.CLIENTID}:${process.env.SECRETKEY}`
        ).toString("base64");

        let newToken = await axios
          .post(
            `https://login.eveonline.com/v2/oauth/token`,
            qs.stringify({
              grant_type: "refresh_token",
              refresh_token: pilot.refreshToken,
              scope: process.env.ESI,
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${key}`,
                Host: "login.eveonline.com",
              },
            }
          )
            console.log("refresh response", newToken.data);
            res.json(newToken.data);
            db.Pilot.findOneAndUpdate(
              { id: pilot.id },
              {
                refreshToken: newToken.data.refresh_token,
                token: newToken.data.access_token,
                token_expire: newToken.data.expires_in,
                token_date: newToken.headers.date,
              },
              { new: true }
            ).then(updatedPilot => console.log(updatedPilot))
      
          .catch(err => {
            console.log("err: ", err);
            res.json(err);
          });
      })
      .catch(err => console.log("err: \n", err));
  });

  app.post("/api/charInfo", async (req, res) => {
    console.log(req.body + "\n -------");
    db.Pilot.findOneAndUpdate(
      { id: req.body.id },
      {
        name: req.body.name,
        id: req.body.id,
        portrait: req.body.portrait,
        corpID: req.body.corpID,
        allianceID: req.body.allianceID,
        token: req.body.token,
        refreshToken: req.body.refreshToken,
      },
      { upsert: true, new: true }
    )
      .then(doc => {
        console.log("pilot: \n", doc);
      })
      .catch(err => console.log("err: \n", err));
    db.Entity.findOneAndUpdate(
      { id: req.body.corpID },
      {
        name: req.body.corp,
        id: req.body.corpID,
        portrait: req.body.corpPortrait,
        type: "corp",
      },
      { upsert: true, new: true }
    )
      .then(doc => {
        console.log("corp: \n", doc);
      })
      .catch(err => console.log("err: \n", err));

    if (req.body.allianceID) {
      db.Entity.findOneAndUpdate(
        { id: req.body.allianceID },
        {
          name: req.body.alliance,
          id: req.body.allianceID,
          portrait: req.body.alliPortrait,
          type: "alliance",
        },
        { upsert: true, new: true }
      )
        .then(doc => {
          console.log("alliance \n", doc);
        })
        .catch(err => console.log("err: \n", err));
    }
    res.status(202);
  });
};
