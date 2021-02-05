module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 8080,
    URL: process.env.BASE_URL || 'http://localhost:8080',
    MONGODB_URL: process.env.MONGODB_URL ||
        // ?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false'
        'mongodb://redloney:redloney233@localhost:27017/redloney',
    JWT_SECRET: process.env.JWT_SECRET || 'secret'
}