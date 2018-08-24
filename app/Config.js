var uristring =
  process.env.MONGODB_URI ||
  'mongodb://localhost/vue-test';

module.exports = {
  DB: uristring,
  APP_PORT: 4000
}
