const { _ } = require('lodash')
const mongoose = require("mongoose");
const Users = require('../../database/models/user.model')
const { ApolloError, AuthenticationError, ForbiddenError, UserInputError } = require( 'apollo-server-express');

module.exports = {
  Query: {
    // Users
    users: async (parent, args) => {
      return await Users.find()
    },
    getUsers: async (parent, args) => {
      const { search , page = 1, limit = 20 } = args;
console.log('args', args)
//console.log('parent',parent)
      let searchQuery = {};
      if (search ) {
        searchQuery = {
          $or: [
            { firstName:  { $regex: search, $options: 'i' } },
            { lastName:   { $regex: search, $options: 'i' } },
            { username:   { $regex: search, $options: 'i' } },
            { email:      { $regex: search, $options: 'i' } },
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
      console.log('getUser', args, _id)
      return await Users.findById(_id )
//       const userRecord = await Users.findById(_id);
// console.log(userRecord)
//       if (userRecord) {
//         return {
//           __typename: "User",
//           ...userRecord,
//         };
//       }
//       return {
//         __typename: "UserNotFound",
//         message: `The user with the id ${args._id} does not exist.`,
//       };
    },
  },

  Mutation: {
    createUser: async (parent, args, context, info) => {
      // throw new UserInputError(
      //   "Name could not be fetched.",
      //   "CAN_NOT_FETCH_BY_ID",
      // );
console.log('createUser args', args)
      const {username, firstName, lastName, date_of_birth, email, password} = args.input;
      const _id = new mongoose.Types.ObjectId();
      let error = {}
      const user = new Users({
        _id,
        username,
        firstName,
        lastName,
        date_of_birth,
        email,
        password,
      })

      await user.save((err, user) => {
        if (err) {
console.log('save error', JSON.stringify(err), err.code)
          error = err
          //return new ApolloError('Email already taken', 'USER_ERROR');
        } else {
          const id = user._id.toString()
console.log('saved user', user, id)
        }
      })
      return user

      /*  await Users.findOne({ username:username }, doc => {
        console.log('createUser findSaved', doc)
        return
        if (err) throw err;
         
        // test a matching password
        user.comparePassword(password, (err, isMatch) => {
            if (err) throw err;
            console.log(`Password (${password}):`, isMatch); // -&gt; Password123: true
        });
         
        // test a failing password
        user.comparePassword(password, (err, isMatch) => {
            if (err) throw err;
            console.log(`Password (${password}):`, isMatch); // -&gt; 123Password: false
        });
      });

      return newUser */
    },
    deleteUser: async (parent, args, context, info) => {
      const { _id } = args
      await Users.findByIdAndDelete({_id})
      return "OK"
    },
    updateUser: async (parent, args, context, info) => {
      const { _id } = args
      const {firstName, lastName, date_of_birth, email} = args.user;

      const user = await Users.findByIdAndUpdate(
        _id, 
        {firstName, lastName, date_of_birth, email}, 
        {new: true}
      )
      return user
    }
  }
};