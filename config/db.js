const mongoose = require ('mongoose');
const dbUrl = require ('./properties').DB;
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
