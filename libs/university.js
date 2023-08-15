const randomstring = require("randomstring");

const University = require("../models/University");
const joi = require("../validation/university");
const commonFunc = require("./common");
const utils = require("../utils/utils");

module.exports = {
  create(input) {
    return new Promise((resolve) => {
      try {
        const validation = joi.createUpdateUniversity(input);
        if (validation.error) {
          return resolve({
            error: validation.error,
            severity: "error bg",
            message: "Please fix fields in red below.",
          });
        } else {
          const prefix = utils.getFirstLetters(validation.value?.name);
          const code = `${prefix ? `${prefix}-` : ""}${randomstring.generate({
            length: 3,
            charset: ["numeric"],
          })}`;
          return new University({ ...validation.value, code })
            .save()
            .then(() =>
              resolve({
                error: null,
                severity: "success bg",
                message: "University has been created succesfully.",
              })
            )
            .catch(() =>
              resolve({
                error: null,
                severity: "error bg",
                message: "Something went wrong!",
              })
            );
        }
      } catch (ex) {
        console.error(ex);
        return resolve({
          error: null,
          severity: "error bg",
          message: "Something went wrong!",
        });
      }
    });
  },
  update(input) {
    return new Promise(async (resolve) => {
      try {
        const validation = joi.createUpdateUniversity(input);
        if (validation.error) {
          return resolve({
            error: validation.error,
            severity: "error bg",
            message: "Please fix fields in red below.",
          });
        } else {
          if (validation.value?.id) {
            const { id } = validation.value;
            delete validation.value.id;
            const { error, data } = await commonFunc.findOneAndUpdate(
              { id },
              validation.value,
              University
            );
            if (error || !data) {
              return resolve({
                error: null,
                severity: "error bg",
                message: "Something went wrong while updating the record.",
              });
            } else {
              return resolve({
                error: null,
                severity: "success bg",
                message: "Record has been updated successfully.",
              });
            }
          } else {
            return resolve({
              error: null,
              severity: "error bg",
              message: "Something went wrong while validating record.",
            });
          }
        }
      } catch (ex) {
        console.error(ex);
        return resolve({
          error: null,
          severity: "error bg",
          message: "Something went wrong!",
        });
      }
    });
  },
  universities() {
    return new Promise(async (resolve) => {
      const match = {};
      const project = {
        id: "$id",
        name: "$name",
        code: "$code",
        establishedYear: "$establishedYear",
        address: "$address",
      };
      const { response } = await commonFunc.queryExecutor(
        { match, project },
        University
      );
      return resolve({ response });
    });
  },
  findById(input) {
    return new Promise(async (resolve) => {
      try {
        const validation = joi.universityId(input);
        if (validation.error) {
          return resolve({
            hasError: true,
            response: null,
          });
        } else {
          const { error, data } = await commonFunc.findByAttribute(
            { id: validation.value?.id },
            University
          );
          return resolve({ hasError: !!error, response: data });
        }
      } catch (ex) {
        console.error(ex);
        return resolve({ hasError: true, response: {} });
      }
    });
  },
};
