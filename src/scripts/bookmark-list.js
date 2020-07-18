import $ from 'jquery';
import api from './api';
import store from './store';


/******************* TEMPLATE FUNCTIONS ************************/
const generateDefaultView = function () {
  return `<form>
<button type="submit" value="Submit" id='new'>New</button>
<select id="filter" name="filter">
  <option value="five">5 Star</option>
  <option value="four">4 Star</option>
  <option value="three">3 Star</option>
  <option value="two">2 Start</option>
  <option value="one">1 Start</option>
</select>
</form>

<ul class="bookmark-list">
</ul>`;

};

const generateBookmarkElement = function (bookmark) {
  return `<li class="bookmark-list-item">
  <span>${bookmark.title}</span>
  <input name="expand" type="checkbox" id="expand">
  <label for="expand">More  Details</label>
  <p>${bookmark.rating}
  <p>★★★★★</p>
</li>`;
};

const generateNewBookmarkView = function () {
  return `<h2>New Bookmark</h2>

  <form class='new-bookmark'>
    <label class='item' for="link-title">Title:</label><br>
    <input id="link-title" type="text" name="title" autofocus='on'>

    <label class='item' for="link-url">Link:</label><br>
    <input id="link-url" type="text" name="url" >

    <label class='item' for="link-description">Description:</label>
    <textarea id="link-description" name="desc"></textarea>

    <button class='item' type="submit" id='cancel'>Cancel</button>
    <button class='item' type="submit" id='create'>Create</button>
    

  </form>`;
};

/******************* ERROR HANDLING ************************/
const generateError = function (message) {
  return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
};

const renderError = function () {
  if (store.error) {
    const el = generateError(store.error);
    $('.error-container').html(el);
  } else {
    $('.error-container').empty();
  }
};

const handleCloseError = function () {
  $('.error-container').on('click', '#cancel-error', () => {
    store.setError(null);
    renderError();
  });
};

/******************* EVENT HANDLING FUNCTIONS  ************************/

const handleNewBookmarkView = function () {
  // New bookmark page button
  $('main').on('click', '#new', event => {
    event.preventDefault();
    const newBookmark = generateNewBookmarkView();
    $('main').html(newBookmark);
  });
};

const cancelNewBookmarkView = function () {
  //return to default view here
  $('main').on('click', '#cancel', event => {
    event.preventDefault();
    render();
  });
};

const handleNewBookmarkSubmit = function () {
  $('main').on('click', '#create', event => {
    event.preventDefault();
    
    const newTitle = $('#link-title').val();
    const newUrl = $('#link-url').val();
    const newBookmark = {newTitle, newUrl};

    console.log(newBookmark);
    api.createBookmark(newTitle, newUrl)
      .then((newEntry) => {
        store.addBookmark(newEntry);
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
    
  });

};

/******************* RENDER FUNCTIONS  ************************/
const render = function () {
  renderError();
  defaultView();
};

const defaultView = function () {
  // render the BOOKMARKS in the DOM

  let bookmarks = [...store.bookmarks];
  const bookmarkItemsString = generateBookmarkItemsString(bookmarks);
  const defaultView = generateDefaultView();

  // insert that HTML into the DOM
  $('main').html(defaultView + bookmarkItemsString);
};

const generateBookmarkItemsString = function (bookmarkList) {
  const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
  return bookmarks.join('');
};

const eventListeners = function () {
  handleNewBookmarkView();
  cancelNewBookmarkView();
  handleNewBookmarkSubmit();
};


export default {
  render,
  eventListeners
};