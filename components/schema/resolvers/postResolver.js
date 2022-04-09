const { _ } = require('lodash')
const Posts = require('../../database/models/post.model')

module.exports = {
  Query: {
    // Posts
    getPosts: async (parent, args) => {
      const { search , page = 1, limit = 10 } = args;
      console.log(args)
      let searchQuery = {};
      if (search) {
        // update the search query
        searchQuery = {
          $or: [
            { author:       { $regex: search, $options: 'i' } },
            { title:        { $regex: search, $options: 'i' } },
            { subtitle:     { $regex: search, $options: 'i' } },
            { description:  { $regex: search, $options: 'i' } },
          ]
        };
      }
      
      const count = await Posts.countDocuments(searchQuery);
      const totalPages = Math.ceil(count / limit)
      const correctedPage = totalPages < page ? totalPages : page

      const posts = await Posts.find(searchQuery)
        .limit(limit)
        .skip((correctedPage - 1) * limit)
        .lean();

      return {
        posts,
        totalPages: totalPages,
        currentPage: correctedPage
      }
    },
    getPost: async (parent, args) => {
      const { _id } = args;
      const postRecord = await Posts.findById(_id)
      if (!postRecord) throw new Error(`The post with the id ${_id} does not exist.`)

      return postRecord
    },
  },
  Mutation: {
    createPost: async (parent, args, context, info) => {
console.log('add post args', args)
      const {author, title, subtitle, description, titleimage} = args.input;
      let error = {}

      const post = new Posts({
        author,
        title,
        subtitle,
        description,
        titleimage
      })

      return new Promise((resolve, reject) => {
        post.save().then((post) => {
          resolve(user);
        }).catch((err) => {
          reject(err);
        });
      });
      // try {
      //   await post.save()
      // } catch (err) {
      //   console.log('err', JSON.stringify(err.keyValue) )
      //   throw new ApolloError(`The post with the given data ${JSON.stringify(err.keyValue)} exist.`)
      // }
      // return post
    },
    deletePost: async (parent, args, context, info) => {
      const { _id } = args
      await Posts.findByIdAndDelete({_id})
      return "OK"
    },
    updatePost: async (parent, args, context, info) => {
      const { _id } = args
      const { author, title, description, titleimage} = args.post;

      const post = await Posts.findByIdAndUpdate(
        _id, 
        {title, subtitle, description, titleimage}, 
        {new: true}
      )
      return post
    }
  }
};