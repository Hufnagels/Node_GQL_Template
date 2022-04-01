const { _ } = require('lodash')
const Maps = require('../../database/models/map.model')

module.exports = {
  Query: {
    // Maps
    getMaps: async (parent, args) => {
      const { search = null, page = 1, limit = 20 } = args;
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [ 
            { title:        { $regex: search, $options: 'i' } }, 
            { description:  { $regex: search, $options: 'i' } } 
          ] 
        }
      }
      const maps = await Maps.find(searchQuery)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();
      
      const count = await Maps.countDocuments(searchQuery);
      
      return {
        maps,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    },
    getMap: async (parent, args) => {
      const { _id } = args;
      return await Maps.find({_id: _id })
    },
  },
  };