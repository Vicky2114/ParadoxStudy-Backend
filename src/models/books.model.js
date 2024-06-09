const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  filename: {
    type: String,
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
  type: {
    type: String,
  },
  docs_name: {
    type: String,
  },
  subject: {
    type: String,
  },
  count: {
    type: Number,
  },
  subject: {
    type: String,
  },
  sem: {
    type: String,
  },
});

const Books = mongoose.model("Books", bookSchema);
module.exports = Books;
