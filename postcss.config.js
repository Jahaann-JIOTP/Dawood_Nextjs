// const config = {
//   plugins: ["@tailwindcss/postcss"],
// };

// export default config;
// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// }
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ✅ NEW correct plugin
    autoprefixer: {}
  }
}
