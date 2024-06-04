const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  email: {
    type: String,
    // required: true,
  },
  todo: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("Todo", TodoSchema);