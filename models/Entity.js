const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EntitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    portrait: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    }
});

const Entity = mongoose.model("Entity", EntitySchema, "Entities");
module.exports = Entity;
