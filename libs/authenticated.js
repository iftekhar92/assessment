const moment = require("moment");
const mongoose = require("mongoose");

const Academic = require("../models/Academic");
const joi = require("../validation/academic");
const commonFunc = require("./common");

module.exports = {
  availableSession(input, context) {
    return new Promise(async (resolve) => {
      const response = {};
      try {
        const validation = joi.availableSession(input);
        if (validation.error) {
          return resolve({
            message: "Please provide Dean id",
          });
        } else {
          const { uid = 0, type = "" } = context?.user || {};
          if (uid) {
            const { error, data } = await commonFunc.findByAttribute(
              { uid: parseInt(uid), type },
              Academic
            );
            if (!error && data) {
              const deanResponse = await commonFunc.findByAttribute(
                { uid: parseInt(validation.value.deanUID) },
                Academic
              );
              if (deanResponse.error || !deanResponse.data) {
                response.message = "Sorry, Dean not found.";
              } else {
                const { availability } = deanResponse.data;
                if (availability.length > 0) {
                  const currentHour = moment().hours();
                  const freeSlots = availability.reduce((acc, item) => {
                    if (Object.keys(item).length > 0) {
                      const { bookAt, slots } = item;
                      const currentDate = moment().format("YYYY-MM-DD");
                      const bookedAt = moment(bookAt).format("YYYY-MM-DD");
                      if (moment(currentDate).isSameOrBefore(bookedAt)) {
                        const availableSlots = slots.filter(
                          (x) =>
                            x.fkAcademicUID === 0 &&
                            moment(x.from, "HH:mm").hours() >= currentHour && {
                              _id: x._id,
                              from: x.from,
                              to: x.to,
                            }
                        );
                        acc.push({
                          date: moment(bookAt).format("dddd, YYYY-MM-DD"),
                          slots: availableSlots,
                        });
                      }
                    }
                    return acc;
                  }, []);
                  response.message =
                    freeSlots.length > 0
                      ? "Slots are available"
                      : "Sorry, there is no slot available";
                  response.availablity = freeSlots;
                }
              }
            } else {
              response.message = "Token is invalid or user not found.";
            }
          } else {
            response.message = "Please provide a valid token.";
          }
        }
      } catch (error) {
        console.error(error);
        response.message = "Something went wrong!";
      }
      return resolve(response);
    });
  },
  bookSession(input, context) {
    return new Promise(async (resolve) => {
      const response = {};
      try {
        const validation = joi.bookSession(input);
        if (validation.error) {
          response.message = "Please provide slot _id";
          response.severity = "error";
        } else {
          const { uid = 0 } = context?.user || {};
          const { deanUID = 0, slotId = "" } = validation?.value || {};
          if (uid) {
            const { error, data } = await commonFunc.findByAttribute(
              { uid: parseInt(uid), type: "STUDENT" },
              Academic
            );
            const deanResponse = await commonFunc.findByAttribute(
              { uid: parseInt(deanUID) },
              Academic
            );
            if (error || !data) {
              response.message = "Authentication failed. No user found!";
              response.severity = "error";
            } else if (deanResponse.error || !deanResponse.data) {
              response.message = "Sorry, No Dean found!";
              response.severity = "error";
            } else {
              const { availability } = deanResponse.data;
              if (availability.length > 0) {
                const getSlot = availability.reduce((acc, item, i) => {
                  const slot = item.slots.find(
                    (x) =>
                      x._id.toString() === slotId.toString() &&
                      x.fkAcademicUID === 0
                  );
                  if (slot) {
                    acc._id = item._id;
                    acc.slotId = slot._id;
                    acc.from = slot.from;
                    acc.to = slot.to;
                  }
                  return acc;
                }, {});
                if (Object.keys(getSlot).length > 0) {
                  const condition = {
                    "availability.slots": {
                      $elemMatch: { _id: getSlot.slotId },
                    },
                  };
                  const setData = {
                    $set: {
                      "availability.$[].slots.$[x].fkAcademicUID":
                        parseInt(uid),
                      "availability.$[].slots.$[x].fkStudentName": data.name,
                    },
                  };
                  const arrFilters = {
                    arrayFilters: [{ "x._id": getSlot.slotId }],
                  };
                  const upsert = { upsert: false };
                  const updateSlot = await commonFunc.updateNestedByAttributes(
                    condition,
                    setData,
                    arrFilters,
                    upsert,
                    Academic
                  );
                  if (updateSlot.error || !updateSlot.data) {
                    response.message = "Something went wrong.";
                    response.severity = "error";
                  } else if (
                    !updateSlot.error &&
                    updateSlot.data &&
                    !updateSlot.data.acknowledged
                  ) {
                    response.message =
                      "Something went wrong, while updating record.";
                    response.severity = "error";
                  } else {
                    response.message = `Session is booked now. Please be online between ${getSlot.from}-${getSlot.to}`;
                    response.severity = "success";
                  }
                } else {
                  response.message =
                    "Sorry, No slot is available. Please choose another";
                  response.severity = "error";
                }
              }
            }
          } else {
            response.message = "Please provide a valid token.";
          }
        }
      } catch (error) {
        console.error(error);
      }
      return resolve(response);
    });
  },
  updateBookedSession(input, context) {
    return new Promise(async (resolve) => {
      const response = {};
      try {
        const validation = joi.updateBookedSession(input);
        if (validation.error) {
          response.error = validation.error;
          response.message = "Please provide input";
          response.severity = "error";
        } else {
          const { uid = 0 } = context?.user || {};
          const { error, data } = await commonFunc.findByAttribute(
            { uid: parseInt(uid), type: "DEAN" },
            Academic
          );
          if (error || !data) {
            response.message = "Authentication failed. No user found!";
            response.severity = "error";
          } else {
            const { studentUID, currentSlotId, targetSlotId } =
              validation.value;
            const isValidCurrentSlotId =
              mongoose.Types.ObjectId.isValid(currentSlotId);
            const isValidTargetSlotId =
              mongoose.Types.ObjectId.isValid(targetSlotId);
            if (isValidCurrentSlotId && isValidTargetSlotId) {
              const stRes = await commonFunc.findByAttribute(
                { uid: parseInt(studentUID), type: "STUDENT" },
                Academic
              );

              const condition = {
                "availability.slots": {
                  $elemMatch: {
                    _id: new mongoose.Types.ObjectId(currentSlotId),
                  },
                },
              };
              const setData = {
                $set: {
                  "availability.$[].slots.$[x].fkAcademicUID": 0,
                  "availability.$[].slots.$[x].fkStudentName": "",
                },
              };
              const arrFilters = {
                arrayFilters: [
                  { "x._id": new mongoose.Types.ObjectId(currentSlotId) },
                ],
              };
              const upsert = { upsert: false };
              const updateSlot = await commonFunc.updateNestedByAttributes(
                condition,
                setData,
                arrFilters,
                upsert,
                Academic
              );
              if (updateSlot.error || !updateSlot.data) {
                response.message = "Something went wrong.";
                response.severity = "error";
              } else if (
                !updateSlot.error &&
                updateSlot.data &&
                !updateSlot.data.acknowledged
              ) {
                response.message =
                  "Something went wrong, while updating record.";
                response.severity = "error";
              } else {
                const targetCondition = {
                  "availability.slots": {
                    $elemMatch: {
                      _id: new mongoose.Types.ObjectId(targetSlotId),
                    },
                  },
                };
                const setTargetData = {
                  $set: {
                    "availability.$[].slots.$[x].fkAcademicUID":
                      parseInt(studentUID),
                    "availability.$[].slots.$[x].fkStudentName":
                      stRes?.data?.name || "",
                  },
                };
                const arrTargetFilters = {
                  arrayFilters: [
                    { "x._id": new mongoose.Types.ObjectId(targetSlotId) },
                  ],
                };
                const targetUpsert = { upsert: false };
                const targetUpdatedSlot =
                  await commonFunc.updateNestedByAttributes(
                    targetCondition,
                    setTargetData,
                    arrTargetFilters,
                    targetUpsert,
                    Academic
                  );
                if (targetUpdatedSlot.error || !targetUpdatedSlot.data) {
                  response.message =
                    "Something went wrong while updating target slot.";
                  response.severity = "error";
                } else if (
                  !targetUpdatedSlot.error &&
                  targetUpdatedSlot.data &&
                  !targetUpdatedSlot.data.acknowledged
                ) {
                  response.message =
                    "Something went wrong, while updating target slot.";
                  response.severity = "error";
                } else {
                  response.message = "Session has been updated.";
                  response.severity = "success";
                }
              }
            } else {
              response.message =
                "Slots id is not a valid. Please check and try again";
              response.severity = "error";
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
      return resolve(response);
    });
  },
  meetings(context) {
    return new Promise(async (resolve) => {
      const response = {};
      try {
        const { uid = 0 } = context?.user || {};
        const { error, data } = await commonFunc.findByAttribute(
          { uid: parseInt(uid), type: "DEAN" },
          Academic
        );
        if (error || !data) {
          response.message = "Authentication failed. No user found!";
          response.severity = "error";
        } else {
          const { availability } = data;
          if (availability.length > 0) {
            const currentHour = moment().hours();
            const freeSlots = availability.reduce((acc, item) => {
              if (Object.keys(item).length > 0) {
                const { bookAt, slots } = item;
                const currentDate = moment().format("YYYY-MM-DD");
                const bookedAt = moment(bookAt).format("YYYY-MM-DD");

                if (moment(currentDate).isSameOrBefore(bookedAt)) {
                  const availableSlots = slots.filter(
                    (x) =>
                      x.fkAcademicUID > 0 &&
                      moment(x.from, "HH:mm").hours() >= currentHour && {
                        _id: x._id,
                        from: x.from,
                        to: x.to,
                        fkAcademicUID: x.fkAcademicUID,
                        fkStudentName: x.fkStudentName,
                      }
                  );
                  if (availableSlots.length > 0) {
                    acc.push({
                      date: moment(bookAt).format("dddd, YYYY-MM-DD"),
                      slots: availableSlots,
                    });
                  }
                }
              }
              return acc;
            }, []);
            response.message =
              freeSlots.length > 0
                ? "Slots are available"
                : "Sorry, there is no slot available";
            response.availablity = freeSlots;
          }
        }
      } catch (error) {
        console.error(error);
      }
      return resolve(response);
    });
  },
  academicList(context) {
    return new Promise(async (resolve) => {
      const response = { message: "", response: [] };
      try {
        const { uid = 0 } = context?.user || {};
        const { error, data } = await commonFunc.findByAttribute(
          { uid: parseInt(uid) },
          Academic
        );
        if (uid > 0 && (error || !data)) {
          response.message = "Authentication failed. No user found!";
        } else {
          const match = { name: { $ne: "" } };
          if (uid > 0) {
            match.fkUniversityID = parseInt(data.fkUniversityID);
          }
          const project = {
            uid: "$uid",
            name: "$name",
            type: "$type",
          };
          const academicRes = await commonFunc.queryExecutor(
            { match, project },
            Academic
          );
          if (academicRes.response.length === 0) {
            response.message = "No user found!";
          } else {
            response.message = "Academic list";
            response.response = academicRes.response.map((item) => ({
              uid: item.uid,
              name: item.name,
              type: item.type,
            }));
          }
        }
      } catch (error) {
        console.error(error);
      }
      return resolve(response);
    });
  },
};
