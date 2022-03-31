const Maps = require('./mongodb/map.model.js')
const User = require('./mongodb/user.model.js')

/**
* GraphQL Resolvers 
**/

const resolvers = {
  Query:{
    getMaps: async (_, args) => {
      const maps = await Maps.find()
      return maps
    },
  },
    
};

module.export = resolvers