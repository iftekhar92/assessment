module.exports = {
  findByAttribute(condition, modal) {
    return new Promise((resolve) =>
      modal
        .findOne(condition)
        .then((data) => resolve({ error: null, data }))
        .catch((error) => resolve({ error, data: null }))
    );
  },
  updateByAttributes(condition, valueObj, modal) {
    return new Promise((resolve) =>
      modal
        .updateOne(condition, { $set: valueObj })
        .then((data) => resolve({ error: null, data }))
        .catch((error) => resolve({ error, data: null }))
    );
  },
  updateNestedByAttributes(condition, setData, arrFilters, upsert, modal) {
    return new Promise((resolve) =>
      modal
        .updateMany(condition, setData, arrFilters, upsert)
        .then((data) => resolve({ error: null, data }))
        .catch((error) => resolve({ error, data: null }))
    );
  },
  findOneAndUpdate(condition, valueObj, modal) {
    return new Promise((resolve) =>
      modal
        .findOneAndUpdate(condition, { $set: valueObj })
        .then((data) => resolve({ error: null, data }))
        .catch((error) => resolve({ error, data: null }))
    );
  },
  queryExecutor(objParams, Modal) {
    return new Promise((resolve) => {
      const {
        match = {},
        matchCallback = {},
        group = {},
        skip = 0,
        limit = 0,
        sort = {},
        sample = {},
        addFields = {},
        project = {},
        unwind = null,
        lookup = {},
      } = objParams;
      const condition = [];

      if (Object.keys(match).length > 0) {
        condition.push({ $match: match });
      }
      if (Object.keys(lookup).length > 0) {
        condition.push({ $lookup: lookup });
      }
      if (unwind) {
        condition.push({ $unwind: unwind });
      }
      if (Object.keys(matchCallback).length > 0) {
        condition.push({ $match: matchCallback });
      }
      if (Object.keys(project).length > 0) {
        condition.push({ $project: project });
      }
      if (Object.keys(group).length > 0) {
        condition.push({ $group: group });
      }
      if (skip > 0) {
        condition.push({ $skip: skip });
      }
      if (limit > 0) {
        condition.push({ $limit: limit });
      }
      if (Object.keys(sort).length > 0) {
        condition.push({ $sort: sort });
      }
      if (Object.keys(sample).length > 0) {
        condition.push({ $sample: sample });
      }
      if (Object.keys(addFields).length > 0) {
        condition.push({ $addFields: addFields });
      }

      return Modal.aggregate(condition)
        .then((response) => resolve({ response }))
        .catch(() => resolve({ response: [] }));
    });
  },
};
