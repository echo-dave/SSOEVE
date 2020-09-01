const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PilotSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    portrait: {
        type: String,
        required: true
    },
    corpID: {
        type: Number,
        required: true
    },
    allianceID: {
        type: Number,
        require: false
    },
    token: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    token_expire: {
        type: Number
    },
    token_date: {
        type: Date
    }
});

const Pilot = mongoose.model("Pilot", PilotSchema);
module.exports = Pilot;