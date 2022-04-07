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

    getUser: async (parent, args, context) => {
      const { _id } = args;
console.log('getUser args,id', args, _id, context)
      //return await Users.findById(_id )
      const userRecord = await Users.findById(_id);
console.log('getUser userRecord', userRecord)
      if (!userRecord) throw new Error(`The user with the id ${_id} does not exist.`)

      return userRecord
    },
  },

  Mutation: {
    createUser: async (parent, args, context, info) => {
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

      return new Promise((resolve, reject) => {
        user.save().then((user) => {
          resolve(user);
        }).catch((err) => {
          reject(err);
        });
      });
      
      // try {
      //   await user.save()
      // } catch (err) {
      //   console.log('err', JSON.stringify(err.keyValue) )
      //   //throw new ApolloError(`The user with the given data ${JSON.stringify(err.keyValue)} exist.`)
      //   return err
      // }
      // return user

    },
    deleteUser: async (parent, args, context, info) => {
      const { _id } = args
      await Users.findByIdAndDelete({_id})
      return true
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