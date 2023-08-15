const Course = require("../models/Course");
const joi = require("../validation/course");
const commonFunc = require("./common");

module.exports = {
  create(input) {
    return new Promise((resolve) => {
      try {
        const validation = joi.createUpdateCourse(input);
        if (validation.error) {
          return resolve({
            error: validation.error,
            severity: "error bg",
            message: "Please fix fields in red below.",
          });
        } else {
          return new Course(validation.value)
            .save()
            .then(() =>
              resolve({
                error: null,
                severity: "success bg",
                message: "Course has been created succesfully.",
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
        const validation = joi.createUpdateCourse(input);
        if (validation.error) {
          return resolve({
            error: validation.error,
            severity: "error bg",
            message: "Please fix fields in red below.",
          });
        } else {
          if (inputObj.id) {
            const { id } = validation.value;
            delete validation.value.id;
            const { error, data } = await commonFunc.findOneAndUpdate(
              { id },
              validation.value,
              Course
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
  courses() {
    return new Promise(async (resolve) => {
      const match = {};
      const project = {
        id: "$id",
        fkUniversityID: "$fkUniversityID",
        university: "$university.name",
        name: "$name",
        duration: "$duration",
      };
      const lookup = {
        from: "universities",
        localField: "fkUniversityID",
        foreignField: "id",
        as: "university",
      };
      const unwind = "$university";
      const { response } = await commonFunc.queryExecutor(
        { match, project, lookup, unwind },
        Course
      );
      return resolve({ response });
    });
  },
  findById(input) {
    return new Promise(async (resolve) => {
      try {
        const validation = joi.courseId(input);
        if (validation.error) {
          return resolve({
            hasError: true,
            response: null,
          });
        } else {
          const { error, data } = await commonFunc.findByAttribute(
            { id: validation.value?.id },
            Course
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
