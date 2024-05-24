const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  filename: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
  },
  chatId: {
    type: String,
  },
  uri: {
    type: String,
  },
  sem: {
    type: String,
  },
});

const Books = mongoose.model("Books", bookSchema);
module.exports = Books;
