const bookmarks = [];
let error = null;
let filter = 0;


const findById = function (id) {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
};

const addBookmark = function (bookmark) {
  this.bookmarks.push(bookmark);
};


const findAndUpdate = function (id, newData) {
  console.log(newData);
  const currentBookmark = this.findById(id);
  Object.assign(currentBookmark, newData);

};

const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
};

const setError = function (error) {
  this.error = error;
};

export default {
  bookmarks,
  findById,
  addBookmark,
  findAndUpdate,
  findAndDelete,
  error,
  setError
};