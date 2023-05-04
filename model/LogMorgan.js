const {model, Schema} = require('mongoose');

const LogMorgan = model('logMorgan',new Schema({
    log: {
        type: String,
    }
}));

module.exports = LogMorgan;