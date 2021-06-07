const mongoose = require ('mongoose');
require("dotenv").config();
const dbUrl = process.env.CONNDB;

module.exports = () => {
    mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true } )
    .then(() => console.log(`Mongo connected on ${dbUrl}`))
    .catch(err => console.log(`Connection has error ${err}` ))

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log(`Mongo is disconnected`);
            process.exit(0);
        });
    });
}
