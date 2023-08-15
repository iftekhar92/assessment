const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const autoincremental = require("../utils/counter");

const courseSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    min: 1,
  },
  fkUniversityID: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    min: 3,
    max: 150,
  },
  duration: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
});

courseSchema.pre("validate", function (next) {
  if (this.isNew) {
    autoincremental(model, this, next);
  }
});

const model = mongoose.model("Course", courseSchema);
module.exports = model;
