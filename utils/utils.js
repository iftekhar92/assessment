const mongoose = require("mongoose");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { faker } = require("@faker-js/faker");

const config = require("../config/constants");

module.exports = {
  getFirstLetters(str) {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  },
  getDurationInHours() {
    const fromTime = moment(config.deanAvailabilityTimeFrom, "HH:mm");
    const toTime = moment(config.deanAvailabilityTimeTo, "HH:mm");
    const duration = moment.duration(toTime.diff(fromTime));
    const hours = [];
    for (let i = 0, diff = duration.hours(); diff > i; i++) {
      hours.push({
        from: moment(fromTime).add(i, "hours").format("HH:mm"),
        to: moment(fromTime)
          .add(i + 1, "hours")
          .format("HH:mm"),
      });
    }
    return hours;
  },
  getAvailability(interval = 1, type = "months") {
    const frequency = [];
    try {
      const currentDate = moment().format("YYYY-MM-DD");
      const lastDate = moment(currentDate)
        .add(interval, type)
        .format("YYYY-MM-DD");

      for (
        const counter = moment(currentDate);
        counter.isSameOrBefore(lastDate);
        counter.add(1, "day")
      ) {
        const currentDay = moment(counter).format("dddd");
        const availabileHours = this.getDurationInHours();

        if (config.deanAvailabilityDays.includes(currentDay)) {
          const availability = {
            _id: new mongoose.Types.ObjectId(),
            bookAt: moment(counter).format("YYYY-MM-DD"),
          };
          if (availabileHours.length > 0) {
            availability.slots = availabileHours.reduce((acc, item) => {
              acc.push({
                _id: new mongoose.Types.ObjectId(),
                fkAcademicUID: 0,
                fkStudentName: "",
                ...item,
              });
              return acc;
            }, []);
          } else {
            availability.slots = [];
          }
          frequency.push(availability);
        }
      }
    } catch (error) {
      console.error(error);
    }
    return frequency;
  },
  tokenValidator(token) {
    const result = { status: false, message: "Token is not valid", data: null };
    try {
      const arrToken = token.split(" ");
      if (arrToken[0] === "Bearer") {
        jwt.verify(arrToken[1], config.secretKey, (error, decoded) => {
          if (!error && decoded) {
            result.status = true;
            result.message = "Success";
            result.data = decoded;
          }
        });
      }
      return result;
    } catch (err) {
      return result;
    }
  },
  fakePerson() {
    return faker.person.fullName();
  },
};
