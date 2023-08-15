const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const validate = require("./validate");

const createUpdateSchema = Joi.object({
  id: Joi.number().allow(0).optional().label("ID"),
  name: Joi.string().min(3).max(255).required().trim().label("Name"),
  establishedYear: Joi.number().positive().greater(0).label("Established Year"),
  address: Joi.string().allow("").optional().label("Address"),
});
const universityIdSchema = Joi.object({
  id: Joi.number().positive().greater(0).label("University ID"),
});

const createUpdateUniversity = (input) => validate(input, createUpdateSchema);
const universityId = (input) => validate(input, universityIdSchema);

module.exports = { createUpdateUniversity, universityId };
