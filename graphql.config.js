module.exports = {
  projects: {
      app: {
          schema: ["./schema/typedefs.js"],
          documents: ["**/*.{graphql,js,ts,jsx,tsx}"],
      }
  }
}