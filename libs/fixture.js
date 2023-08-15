const asyncLoop = require("node-async-loop");

const fixtureData = require("../data");
const Academic = require("../models/Academic");
const Course = require("../models/Course");
const University = require("../models/University");
const university = require("../libs/university");
const course = require("../libs/course");
const academic = require("../libs/academic");
const commonFunc = require("../libs/common");

module.exports = {
  createUniversities(input) {
    return new Promise(async (resolve) => {
      try {
        return asyncLoop(
          input,
          async (item, next) => {
            const { data } = await commonFunc.findByAttribute(
              {
                name: item.name,
              },
              University
            );
            if (!data) {
              await university.create(item);
              next();
            } else {
              next();
            }
          },
          () =>
            resolve({
              error: null,
              severity: "success",
              message: "Universities have been created.",
            })
        );
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
  createCourses(input) {
    return new Promise(async (resolve) => {
      try {
        return asyncLoop(
          input,
          async (item, next) => {
            const { data } = await commonFunc.findByAttribute(
              {
                name: item.university,
              },
              University
            );
            if (data) {
              const { data: courseData } = await commonFunc.findByAttribute(
                {
                  name: item.name,
                  fkUniversityID: parseInt(data.id),
                },
                Course
              );
              if (!courseData) {
                await course.create({
                  fkUniversityID: parseInt(data.id),
                  name: item.name,
                  duration: item.duration,
                });
                next();
              } else {
                next();
              }
            } else {
              next();
            }
          },
          () =>
            resolve({
              error: null,
              severity: "success",
              message: "Courses hvave been created.",
            })
        );
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
  createUsers(input) {
    return new Promise(async (resolve) => {
      try {
        return asyncLoop(
          input,
          async (item, next) => {
            const { data } = await commonFunc.findByAttribute(
              {
                name: item.university,
              },
              University
            );
            if (data) {
              const { data: courseData } = await commonFunc.findByAttribute(
                {
                  name: item.course,
                  fkUniversityID: parseInt(data.id),
                },
                Course
              );
              if (courseData) {
                const { data: academicData } = await commonFunc.findByAttribute(
                  {
                    fkUniversityID: parseInt(data.id),
                    fkCourseID: parseInt(courseData.id),
                    name: item.name,
                  },
                  Academic
                );
                if (!academicData) {
                  await academic.create({
                    fkUniversityID: parseInt(data.id),
                    fkCourseID: parseInt(courseData.id),
                    name: item.name,
                    email: item.email,
                    password: item.password,
                    confirmPassword: item.confirmPassword,
                    type: item.type,
                  });
                  next();
                } else {
                  next();
                }
              } else {
                next();
              }
            } else {
              next();
            }
          },
          () =>
            resolve({
              error: null,
              severity: "success",
              message: "Courses hvave been created.",
            })
        );
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
  create() {
    return new Promise(async (resolve) => {
      try {
        const { universities, courses, users } = fixtureData;
        // Create Univerisity
        await this.createUniversities(universities);
        await this.createCourses(courses);
        await this.createUsers(users);
        return resolve({
          error: null,
          severity: "success",
          message: "Fixtures created successfully.",
        });
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
};
