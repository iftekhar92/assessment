const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const validate = require("./validate");

const createUpdateSchema = Joi.object({
  id: Joi.number().allow(0).optional().label("ID"),
  fkUniversityID: Joi.number()
    .positive()
    .greater(0)
    .required()
    .label("University"),
  name: Joi.string().min(3).max(150).required().trim().label("Name"),
  duration: Joi.string().min(3).max(100).required().trim().label("Duration"),
});
const courseIdSchema = Joi.object({
  id: Joi.number().positive().greater(0).label("Course ID"),
});

const createUpdateCourse = (input) => validate(input, createUpdateSchema);
const courseId = (input) => validate(input, courseIdSchema);

module.exports = { createUpdateCourse, courseId };
