const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const validate = require("./validate");
const config = require("../config/constants");

const createSchema = Joi.object({
  fkUniversityID: Joi.number()
    .positive()
    .greater(0)
    .required()
    .label("University"),
  name: Joi.string().min(3).max(150).required().trim().label("Name"),
  email: Joi.string().email().min(3).max(150).required().trim().label("Email"),
  password: Joi.string().min(6).max(18).required().trim().label("Password"),
  confirmPassword: Joi.string()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),
  fkCourseID: Joi.number().positive().greater(0).required().label("Batch"),
  type: Joi.string()
    .valid("STAFF", "PROFESSOR", "DEAN", "STUDENT")
    .required()
    .label("Academic Type")
    .options({
      messages: {
        "any.only": `{{#label}} does not match. Please use from this list ${config.academicTypes.join(
          ","
        )} accordingly.`,
      },
    }),
});
const loginSchema = Joi.object({
  uid: Joi.number().positive().greater(0).required().label("UID"),
  password: Joi.string().min(6).max(18).required().trim().label("Password"),
});

const academicIdSchema = Joi.object({
  id: Joi.number().positive().greater(0).label("Academic ID"),
});
const availableSessionSchema = Joi.object({
  deanUID: Joi.number().positive().greater(0).label("Dean UID"),
});
const bookSessionSchema = Joi.object({
  deanUID: Joi.number().positive().greater(0).label("Dean UID"),
  slotId: Joi.string().required().trim().label("Slot ID"),
});
const updateBookedSessionSchema = Joi.object({
  studentUID: Joi.number().positive().greater(0).label("Student UID"),
  currentSlotId: Joi.string().required().trim().label("Current slot id"),
  targetSlotId: Joi.string().required().trim().label("Target slot id"),
});

const create = (input) => validate(input, createSchema);
const login = (input) => validate(input, loginSchema);
const academicId = (input) => validate(input, academicIdSchema);
const bookSession = (input) => validate(input, bookSessionSchema);
const availableSession = (input) => validate(input, availableSessionSchema);
const updateBookedSession = (input) =>
  validate(input, updateBookedSessionSchema);

module.exports = {
  create,
  login,
  academicId,
  bookSession,
  availableSession,
  updateBookedSession,
};
