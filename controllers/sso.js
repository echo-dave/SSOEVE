const db = require("../models");
const qs = require("qs");
const axios = require("axios");
import * as Axios from "../utils/axios";

exports.loginSSO = async (req, res) => {
    let appKey = Buffer.from(`${process.env.CLIENTID}:${process.env.SECRETKEY}`).toString('base64');
    
    let res = await axios.post(
        "https://login.eveonline.com/v2/oauth/token",
        { grant_type: "authorization_code", code: req.body.ssoCode },
        {
          headers: {
            Authorization: `Basic ${appKey}`,
            "Content-Type": "application/json",
          },
        }
      )
    let charID = await axios
      .get("https://login.eveonline.com/oauth/verify", {
        headers: {
          Authorization: `Bearer ${res.data.access_token}`,
        },
      })
    charID = charID.data.CharacterID;

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
        res.json(tempInfo)
      console.log("alltempinfo ", tempInfo);
      axios.post(`/api/charInfo`, {...tempInfo, id: charID, token: res.data.access_token, refreshToken: res.data.refresh_token}).then(data => {
        console.log("response ", data.data);
      });

    })
 
  }