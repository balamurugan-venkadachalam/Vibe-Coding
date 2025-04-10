const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxLength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
    default: 'TODO'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        // Due date must be in the future or not set
        return !value || value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Add index for better search performance
taskSchema.index({ title: 'text', description: 'text' });

// Add methods for status updates
taskSchema.methods.toggleComplete = function() {
  this.completed = !this.completed;
  this.status = this.completed ? 'COMPLETED' : 'TODO';
  return this.save();
};

// Add static method for filtering
taskSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 