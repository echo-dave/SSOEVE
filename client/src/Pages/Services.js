import React, { useState, useEffect } from "react";
import axios from "axios";

function Services(props) {
    const [charID, setCharID] = useState(null);
    const [charInfo, setCharInfo] = useState(null);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        (async () => {
      try {
        const query = new URLSearchParams(props.location.search);

        let response = await axios.post("/api/authsso", {ssoCode: query.get("code"),state: query.get("state")});
        console.log(response.data);

        setCharID(response.data.charID);
        setCharInfo(response.data);
        sessionStorage.setItem("charID", response.data.charID);

      } catch (error) {
          console.log(error);
      }
    })();
},[])

    return(
        <div>
        <div style={{ textAlign: "left", width: 900, margin: "2rem auto 0" }}>
          <img
            alt="character portrait"
            src={charInfo != null ? charInfo.portrait : ""}
          />
          <img
            alt="corp portrait"
            src={charInfo != null ? charInfo.corpPortrait : ""}
          />
          <img
            alt="alliance portrait"
            src={charInfo != null ? charInfo.alliPortrait : ""}
          />
          <p>Name: {charInfo != null ? charInfo.name : "loading"}</p>
          <p>Corp: {charInfo != null ? charInfo.corp : "loading"}</p>
          <p>Alliance: {charInfo != null ? charInfo.alliance : ""}</p>
          <p>
            Char Description:{" "}
            {charInfo != null ? (
              <div
                style={{ background: "darkgrey", fontSize: 14 }}
                dangerouslySetInnerHTML={{ __html: charInfo.description }}
              />
            ) : (
              "loading"
            )}
            </p>
            </div>
            </div>

    )
}

export default Services;