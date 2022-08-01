// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: 'profile',

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
}
