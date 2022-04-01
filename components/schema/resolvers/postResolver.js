const { _ } = require('lodash')
const Posts = require('../../database/models/post.model')

module.exports = {
  Query: {
    // Posts
    getPosts: async (parent, args) => {
      const { search = null, page = 1, limit = 20 } = args;
      console.log(args)
      let searchQuery = {};
      if (search) {
        // update the search query
        searchQuery = {
          $or: [
            { author:       { $regex: search, $options: 'i' } },
            { title:        { $regex: search, $options: 'i' } },
            { description:  { $regex: search, $options: 'i' } },
          ]
        };
      }
      const posts = await Posts.find(searchQuery)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();
      
      const count = await Posts.countDocuments(searchQuery);
      
      return {
        posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    },
    getPost: async (parent, args) => {
      const { _id } = args;
      return await Posts.find({_id: _id })
    },
  },
  Mutation: {
    createPost: async (parent, args, context, info) => {
      const {author, title, description, titleimage} = args.post;
      const post = new Posts({
        author, 
        title, 
        description, 
        titleimage}
      )
      await post.save()
      return post
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
        {title, description, titleimage}, 
        {new: true}
      )
      return post
    }
  }
};