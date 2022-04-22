const { _ } = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const Users = require('../../database/models/user.model')
const { ApolloError } = require('apollo-server-express');

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

module.exports = {
  Query: {
    getUsers: async (parent, args) => {
      const { search, page = 1, limit = 10 } = args;
      console.log('args', args)
      //console.log('parent',parent)
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            //{ username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
          sortBy: UPDATEDAT_DESC
        };
      }

      const count = await Users.countDocuments(searchQuery);
      if (!count) return {
        users: [],
        totalPages: 1,
        currentPage: 1,
        count: 0
      }

      const totalPages = Math.ceil(count / limit)
      const correctedPage = totalPages < page ? totalPages : page

      const users = await Users.find(searchQuery)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((correctedPage - 1) * limit)
        .lean();

      return {
        users,
        totalPages: totalPages,
        currentPage: correctedPage,
        count
      }
    },
    getUser: async (parent, args, context) => {
      const { _id } = args;
      console.log('getUser args,id', args, _id, context)
      //return await Users.findById(_id )
      const userRecord = await Users.findById(_id);
      console.log('getUser userRecord', userRecord)
      if (!userRecord) throw new ApolloError(`The user with the id ${_id} does not exist.`, 'USER_NOT_EXISTS_ERROR')
      return userRecord
    },
  },

  Mutation: {
    createUser: async (parent, { input: { /* username, */ firstName, lastName, date_of_birth, email, password } }) => {

      // Check if user exists already
      const existingUser = await Users.findOne({ email })
      if (existingUser) throw new ApolloError('User with this email is exist', 'USER_EXISTS_ERROR')

      // Encrypt password
      // In model is created the hashed password already

      // Build new user
      const _id = new mongoose.Types.ObjectId();
      const newUser = new Users({
        _id,
        // username,
        firstName,
        lastName,
        date_of_birth,
        email: email.toLowerCase(),
        password,
      })

      // Create JSON webtoken
      const token = jwt.sign(
        {
          user_id: newUser._id,
          email
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN
        }
      )
      newUser.token = token

      // Store new User
      const res = await newUser.save()
      console.log('res', res)
      return {
        id: res._id,
        ...res._doc
      }

      return new Promise((resolve, reject) => {
        newUser.save().then((user) => {
          resolve(user);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    deleteUser: async (parent, args, context, info) => {
      const { _id } = args
      await Users.findByIdAndDelete({ _id })
      return true
    },

    updateUser: async (parent, { _id, input: { firstName, lastName, date_of_birth, password } }, context, info) => {
      // const { _id } = args
      // const { firstName, lastName, date_of_birth, email } = args.user;

      const user = await Users.findByIdAndUpdate(
        _id,
        { firstName, lastName, date_of_birth },
        { new: true }
      )
      return user
    },

    loginUser: async (parent, { input: {email, password } }) => {
      const existingUser = await Users.findOne({ email })
      if (!existingUser) throw new ApolloError('User with this credentials does not exists', 'USER_NOT_EXISTS_ERROR')
      
      // Password checking
      const isValid = await bcrypt.compare(password, existingUser.password)
      if (!isValid) throw new ApolloError('User with this credentials does not exists', 'USER_INCORRECT_PASSWORD_ERROR')

      // Create JSON webtoken
      const token = jwt.sign(
        {
          user_id: existingUser._id,
          email
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN
        }
      )
      existingUser.token = token
      return {
        id: existingUser._id,
        ...existingUser._doc
      }
    }
  }
};