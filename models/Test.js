const mongoose = require("mongoose");

const TestSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    quantity: {
        type: Array,
        required: true
    },
    card: {
        type: Array,
        required: true
    },
    user: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// export model user with ListSchema
module.exports = mongoose.model('Test', TestSchema);