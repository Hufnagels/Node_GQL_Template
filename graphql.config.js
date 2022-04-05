module.exports = {
  projects: {
      app: {
          schema: ["./schema/typeDefs.js"],
          documents: ["**/*.{graphql,js,ts,jsx,tsx}"],
      }
  }
}