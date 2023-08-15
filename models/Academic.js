const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const autoincremental = require("../utils/counter");
const config = require("../config/constants");

const academicSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    min: 1,
  },
  fkUniversityID: {
    type: Number,
    required: true,
  },
  fkCourseID: {
    type: Number,
    required: true,
  },
  uid: {
    type: Number,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: config.academicTypes,
    defaultValue: config.academicTypes[3],
  },
  name: {
    type: String,
    required: true,
    min: 3,
    max: 150,
  },
  email: {
    type: String,
    required: true,
    max: 150,
  },
  hasPassword: {
    type: String,
    required: true,
  },
  availability: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      bookAt: {
        type: Date,
        default: Date.now(),
      },
      slots: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          fkAcademicUID: {
            type: Number,
          },
          fkStudentName: {
            type: String,
            defaultValue: "",
          },
          from: {
            type: String,
            defaultValue: "00:00",
          },
          to: {
            type: String,
            defaultValue: "00:00",
          },
        },
      ],
    },
  ],
  registeredAt: {
    type: Date,
    default: Date.now(),
  },
});

academicSchema.pre("validate", function (next) {
  if (this.isNew) {
    autoincremental(model, this, next);
  }
});

academicSchema.methods.comparePassword = (password, hasPassword) =>
  bcrypt.compareSync(password, hasPassword);

const model = mongoose.model("Academic", academicSchema);
module.exports = model;
