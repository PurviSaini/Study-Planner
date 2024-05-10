const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
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
    },
    status: {
        type:String,
        default:""
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;