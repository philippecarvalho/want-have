const mongoose = require("mongoose");

const ListSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    quantity: {
        type: Array,
        required: true,
        default: "1"
    },
    card: {
        type: Array,
        required: true
    },
    image: {
        type: Array
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
module.exports = mongoose.model('List', ListSchema);