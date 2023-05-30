const saveData = (model: any, data: any) => {
  return new Promise((resolve, reject) => {
    try {
      let save_info = model.create(data);
      return resolve(save_info);
    } catch (err) {
      return reject(err);
    }
  });
};

const getData = (model: any, query: any, projection: any, options: any) => {
  return new Promise((resolve, reject) => {
    try {
      let fetch_data = model.find(query, projection, options);
      return resolve(fetch_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const getSingleData = (
  model: any,
  query: any,
  projection: any,
  options: any
) => {
  return new Promise((resolve, reject) => {
    try {
      let fetch_data = model.findOne(query, projection, options);
      return resolve(fetch_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const getUniqueData = (
  model: any,
  key_name: string,
  query: any,
  options: any
) => {
  return new Promise((resolve, reject) => {
    try {
      let fetch_data = model.distinct(key_name, query, options);
      return resolve(fetch_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const findAndUpdate = (model: any, query: any, update: any, options: any) => {
  return new Promise((resolve, reject) => {
    try {
      let update_data = model.findOneAndUpdate(query, update, options);
      return resolve(update_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const updateMany = (model: any, query: any, update: any) => {
  return new Promise((resolve, reject) => {
    try {
      let update_data = model.updateMany(query, update);
      return resolve(update_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const removeData = (model: any, query: any) => {
  return new Promise((resolve, reject) => {
    try {
      let delete_data = model.deleteOne(query);
      return resolve(delete_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const removeMany = (model: any, query: any) => {
  return new Promise((resolve, reject) => {
    try {
      let delete_data = model.deleteMany(query);
      return resolve(delete_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const populateData = (
  model: any,
  query: any,
  projection: any,
  options: any,
  collection_options: any
) => {
  return new Promise((resolve, reject) => {
    try {
      let fetch_data = model
        .find(query, projection, options)
        .populate(collection_options)
        .exec();
      return resolve(fetch_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const populateOneData = (
  model: any,
  query: any,
  projection: any,
  options: any,
  collection_options: any
) => {
  return new Promise((resolve, reject) => {
    try {
      let fetch_data = model
        .findOne(query, projection, options)
        .populate(collection_options)
        .exec();
      return resolve(fetch_data);
    } catch (err) {
      return reject(err);
    }
  });
};


const countData = (model: any, query: any) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("query",query)
      let fetch_data = model.count(query);
      return resolve(fetch_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const aggregateData = (model: any, group: any, options: any) => {
  return new Promise((resolve, reject) => {
    try {
      let fetch_data: any;
      if (options !== undefined) {
        fetch_data = model.aggregate(group).option(options);
      } else {
        fetch_data = model.aggregate(group);
      }

      return resolve(fetch_data);
    } catch (err) {
      return reject(err);
    }
  });
};



const insertData = (model: any, data: any, options: any) => {
  return new Promise((resolve, reject) => {
    try {
      let saveData = model.collection.insert(data, options);
      return resolve(saveData);
    } catch (err) {
      return reject(err);
    }
  });
};

const insertMany = (model: any, data: any, options: any) => {
  return new Promise((resolve, reject) => {
    try {
      let saveData = model.collection.insertMany(data, options);
      return resolve(saveData);
    } catch (err) {
      return reject(err);
    }
  });
};




export {
  saveData,
  getData,
  getSingleData,
  findAndUpdate,
  updateMany,
  removeData,
  removeMany,
  populateData,
  countData,
  aggregateData,
  insertData,
  insertMany,
  populateOneData,
};
