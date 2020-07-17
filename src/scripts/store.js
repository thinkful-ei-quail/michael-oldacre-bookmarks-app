const bookmarks = [{
  id: 'x56w',
  title: 'Title 1',
  rating: 3,
  url: 'http://www.title1.com',
  description: 'lorem ipsum dolor sit',
  expanded: false
},
{
  id: '6ffw',
  title: 'Title 2',
  rating: 5,
  url: 'http://www.title2.com',
  description: 'dolorum tempore deserunt',
  expanded: false
}
];
let error = null;
let filter = 0;
//let hideCheckeditems = false;

const findById = function (id) {
  return this.items.find(currentItem => currentItem.id === id);
};

const addBookmark = function (bookmark) {
  this.bookmarks.push(bookmark);
};


const findAndUpdate = function (id, newData) {
  const currentBookmark = this.findById(id);
  Object.assign(currentBookmark, newData);

};

const findAndDelete = function (id) {
  this.bookmarks = this.addBookmark.filter(currentBookmark => currentBookmark.id !== id);
};

/* const toggleCheckedFilter = function () {
  this.hideCheckedItems = !this.hideCheckedItems;
}; */

const setError = function (error) {
  this.error = error;
};

export default {
  bookmarks,
  //hideCheckeditems,
  findById,
  addBookmark,
  findAndUpdate,
  findAndDelete,
  //toggleCheckedFilter,
  error,
  setError
};