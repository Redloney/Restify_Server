module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3500,
    URL: process.env.BASE_URL || 'http://localhost:3500',
    MONGODB_URL: process.env.MONGODB_URL ||
        'mongodb://redloney:redloney233@localhost:27017/redloney?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    JWT_SECRET: process.env.JWT_SECRET || 'secret'
}