const { _ } = require('lodash')
const Users = require('../../database/models/user.model')

module.exports = {
  Query: {
    // Users
    getUsers: async (parent, args) => {
      const { search = null, page = 1, limit = 20 } = args;
      console.log(args)
      let searchQuery = {};
      if (search) {
        // update the search query
        searchQuery = {
          $or: [
            { first_name:   { $regex: search, $options: 'i' } },
            { family_name:  { $regex: search, $options: 'i' } },
            { username:     { $regex: search, $options: 'i' } },
            { email:        { $regex: search, $options: 'i' } },
          ]
        };
      }
      const users = await Users.find(searchQuery)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();
      
      const count = await Users.countDocuments(searchQuery);
      
      return {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    },
    getUser: async (parent, args) => {
      const { _id } = args;
      return await Users.find({_id: _id })
    },
  },

  Mutation: {
    createUser: async (parent, args, context, info) => {
      const {first_name, family_name, date_of_birth} = args.user;
      const user = new Users({
        first_name,
        family_name,
        date_of_birth,
      })
      await user.save()
      return user
    },
    deletePost: async (parent, args, context, info) => {
      const { _id } = args
      await Users.findByIdAndDelete({_id})
      return "OK"
    },
    updatePost: async (parent, args, context, info) => {
      const { _id } = args
      const {first_name, family_name, date_of_birth} = args.user;

      const user = await Users.findByIdAndUpdate(
        _id, 
        {first_name, family_name, date_of_birth}, 
        {new: true}
      )
      return user
    }
  }
};