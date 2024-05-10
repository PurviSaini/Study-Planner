const mongoose = require('mongoose');
const goalSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    goalTitle: {
        type: String,
        required: true
    },
    subTasks: {
        type: Object,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
    }
});

const Goals = mongoose.model('Goals', goalSchema);

module.exports = Goals;