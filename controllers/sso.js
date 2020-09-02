const db = require("../models");
const qs = require("qs");
const axios = require("axios");
const Axios = require("../utils/axios.js");
const { response } = require("express");

exports.loginSSO = async (req, res) => {
    //getting the bearer token after callback from sso login
    let token;
    let auth;
    console.log("body \n", req.body);
    let appKey = Buffer.from(`${process.env.CLIENTID}:${process.env.SECRETKEY}`).toString('base64');
    try {
        auth = await axios.post(
            "https://login.eveonline.com/v2/oauth/token",
            { grant_type: "authorization_code", code: req.body.ssoCode },
            {
              headers: {
                Authorization: `Basic ${appKey}`,
                "Content-Type": "application/json",
              },
            }
          )
          token = auth.data.access_token;
    } catch (error) {
        console.log(error.response);
        res.status(error.response.status).json({statusText: error.response.statusText})
    }
            //verify the character using the bearer to get the characterId usded to get public info
    let charID = await axios
      .get("https://login.eveonline.com/oauth/verify", {
        headers: {
          Authorization: `Bearer ${auth.data.access_token}`,
        },
      })
    charID = charID.data.CharacterID;

    //getting all the public info
    let tempInfo;
    Promise.all([
      Axios.get(`characters/${charID}`, token).then(async characterInfo => {
        tempInfo = {
          name: characterInfo.data.name,
          description: characterInfo.data.description,
          corpID: characterInfo.data.corporation_id,
          allianceID: characterInfo.data.alliance_id,
        };
        console.log("step1");
        return Promise.all([
        Axios.get(`characters/${charID}/portrait`).then(characterPortrait => {
          tempInfo = {
            ...tempInfo,
            portrait: characterPortrait.data.px64x64,
          };
        }),
        Axios.get(
          `corporations/${characterInfo.data.corporation_id}`,
          token
        ).then(async corp => {
          tempInfo = { ...tempInfo, corp: corp.data.name };
          return Promise.all([
          Axios.get(
            `corporations/${characterInfo.data.corporation_id}/icons/`,
            token
          ).then(data => {
            tempInfo = { ...tempInfo, corpPortrait: data.data.px64x64 };
          }),

          Axios.get(`alliances/${corp.data.alliance_id}`, token).then(data => {
            tempInfo = { ...tempInfo, alliance: data.data.name };
          }),
          Axios.get(`alliances/${corp.data.alliance_id}/icons/`, token).then(
            data => {
              tempInfo = { ...tempInfo, alliPortrait: data.data.px64x64 };
            }
          )
          ])
        })
      ])
      })
    ]).then(() => {
        res.json({charID, ...tempInfo})
      console.log("alltempinfo ", tempInfo);
      axios.post(`http://localhost:8080/api/charInfo`, {...tempInfo, id: charID, token: auth.data.access_token, refreshToken: auth.data.refresh_token})
      .then(() => {
      }).catch(err => {
          console.log("err \n", err.response);
          res.json(err);
      })

    })
 
  }