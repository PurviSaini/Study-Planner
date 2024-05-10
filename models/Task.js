const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    taskTitle: {
        type: String,
        required: true
    },
    taskDesc: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;