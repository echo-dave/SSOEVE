import React, { useState, useEffect } from "react";
import axios from "axios";

function Services(props) {
    const [charID, setCharID] = useState(null);
    const [charInfo, setCharInfo] = useState(null);
    const [locations, setLocations] = useState([]);

  useEffect(async () => {
      try {
        let response = await axios.get("/api/authsso");
        console.log(response.data);
      } catch (error) {
          console.log(error);
      }
    })

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