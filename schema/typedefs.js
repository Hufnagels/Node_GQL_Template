
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    first_name: String
    family_name: String
    date_of_birth: String
    email: String!
    password: String!
    updated_at: String
    created_at: String
  }

  # type UsersResult {
  #   users: [User]
  #   currentPage: Int
  #   totalPages: Int
  # }

  type Map{
    _id: ID!
    owner: String
    title: String
    originalMap: String
    currentMap: String
    mapimage: String
    # editinghistory: EditingHistory
    updated_at: Int
    created_at: Int
  }

  # type EditingHistory {
  #   updated: String
  #   editedMap: String
  # }

  type Query{
    getMaps: [Map]
    # findMapById(_id:ID!):Map
    # getUsers(search: String, page: Int, limit: Int): UsersResult
  }
`;

module.export = typeDefs