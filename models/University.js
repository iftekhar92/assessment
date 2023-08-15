const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const autoincremental = require("../utils/counter");

const universitySchema = new Schema({
  id: {
    type: Number,
    unique: true,
    min: 1,
  },
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  establishedYear: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    defaultValue: "",
  },
});

universitySchema.pre("validate", function (next) {
  if (this.isNew) {
    autoincremental(model, this, next);
  }
});

const model = mongoose.model("University", universitySchema);
module.exports = model;
