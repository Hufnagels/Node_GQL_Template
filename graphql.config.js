module.exports = {
  projects: {
    app: {
      schema: [".src/components/schema/typeDefs.js"],
      documents: ["**/*.{graphql,js,ts,jsx,tsx}"],
    }
  }
}