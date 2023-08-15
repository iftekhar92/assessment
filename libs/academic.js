const moment = require("moment");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");

const Academic = require("../models/Academic");
const University = require("../models/University");
const Course = require("../models/Course");
const joi = require("../validation/academic");
const commonFunc = require("./common");
const config = require("../config/constants");
const utils = require("../utils/utils");

module.exports = {
  create(input) {
    return new Promise(async (resolve) => {
      try {
        const validation = joi.create(input);
        if (validation.error) {
          return resolve({
            error: validation.error,
            severity: "error",
            message: "Please fix fields in red below.",
          });
        } else {
          let availability = [];
          const { fkUniversityID, name, email, password, fkCourseID, type } =
            validation.value;
          // check branch and university and ademic type exist
          const course = await commonFunc.findByAttribute(
            { id: fkCourseID },
            Course
          );
          const university = await commonFunc.findByAttribute(
            { id: fkUniversityID },
            University
          );
          if (course.error || !course.data) {
            return resolve({
              error: null,
              severity: "error",
              message: `Sorry!, ${fkCourseID} id does not exist. Pleasae try another course.`,
            });
          } else if (university.error || !university.data) {
            return resolve({
              error: null,
              severity: "error",
              message: `Sorry!, ${fkUniversityID} id does not exist.`,
            });
          } else if (!config.academicTypes.includes(type)) {
            return resolve({
              error: null,
              severity: "error",
              message: `Sorry!, ${type} id does not exist. Please use from this list ${config.academicTypes.join(
                ","
              )} accordingly.`,
            });
          } else {
            if (type !== config.academicTypes[3]) {
              availability = utils.getAvailability(
                config.availabilityRange.interval,
                config.availabilityRange.type
              );
            }
            const registeredAt = moment(new Date()).format("YYYY-MM-DD");
            const uid = parseInt(
              randomstring.generate({
                length: 5,
                charset: ["numeric"],
              })
            );
            const prepareInput = {
              fkUniversityID,
              name,
              email,
              fkCourseID,
              uid,
              type,
              availability,
              registeredAt,
            };
            const newAcademic = new Academic(prepareInput);
            newAcademic.hasPassword = bcrypt.hashSync(password, 10);
            return newAcademic
              .save()
              .then((response) =>
                resolve({
                  error: null,
                  severity: response ? "success" : "error",
                  message: response
                    ? `Thanks for enrolment. Your UID is ${uid}`
                    : "Something went wrong while creating academic.",
                })
              )
              .catch((error) => {
                if (error) {
                  if (error.code && error.code === 11000) {
                    return resolve({
                      error: null,
                      severity: "error",
                      message:
                        "Something went wrong. Please hit request again.",
                    });
                  } else {
                    return resolve({
                      error: null,
                      severity: "error",
                      message: "Something went wrong!",
                    });
                  }
                } else {
                  return resolve({
                    error: null,
                    severity: "error",
                    message: "Something went wrong!",
                  });
                }
              });
          }
        }
      } catch (ex) {
        console.error(ex);
        return resolve({
          error: null,
          severity: "error",
          message: "Something went wrong!",
        });
      }
    });
  },
  login(input) {
    return new Promise(async (resolve) => {
      try {
        const validation = joi.login(input);
        if (validation.error) {
          return resolve({
            error: validation.error,
            severity: "error",
            message: "Please fix fields in red below.",
            token: "",
          });
        } else {
          const { uid, password } = validation.value;
          const { error, data } = await commonFunc.findByAttribute(
            { uid },
            Academic
          );
          if (error || !data) {
            return resolve({
              error: null,
              severity: "error",
              message: "Authentication failed, No user found.",
              token: "",
            });
          } else {
            if (data) {
              if (!data.comparePassword(password, data.hasPassword)) {
                return resolve({
                  error: null,
                  severity: "error",
                  message: "Authentication failed, wrong password.",
                  token: "",
                });
              } else {
                return resolve({
                  error: null,
                  severity: "success",
                  message: "Logged In successfully.",
                  token: jwt.sign(
                    { uid: data.uid, type: data.type },
                    config.secretKey
                  ),
                });
              }
            }
          }
        }
      } catch (ex) {
        console.error(ex);
        return resolve({
          error: null,
          severity: "error",
          message: "Authentication failed.",
          token: "",
        });
      }
    });
  },
};
