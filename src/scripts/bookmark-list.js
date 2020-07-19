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
  <option value="clear">Clear</option>
</select>
</form>`;

};

const generateBookmarkElement = function (bookmark) {
  let rating = generateRatingStars(bookmark);

  return `<li class="bookmark-list-item" data-item-id="${bookmark.id}">
  <span>${bookmark.title}</span>
  <button type="submit" id='expand'>Expand</button>
  <p>${rating}</p>
</li>`;
};

const generateExpandedBookmarkElement = function (bookmark) {
  let rating = generateRatingStars(bookmark);

  return `<li class="bookmark-list-item" data-item-id="${bookmark.id}">
  <span>${bookmark.title}</span>
  <span>${bookmark.url}</span>
  <button type="submit" id='condense'>Close</button>
  <p>${bookmark.rating}</p>
  <p>${bookmark.desc}</p>
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
    <textarea id="link-desc" name="desc"></textarea>

    <h3>Rating:</h3>
      
      <input name="rating" type="radio" value="1">
       <label for="1">1</label>
      <input name="rating" type="radio" value="2">
       <label for="2">2</label>
      <input name="rating" type="radio" value="3">
       <label for="3">3</label>
      <input name="rating" type="radio" value="4">
       <label for="4">4</label>
      <input name="rating" type="radio" value="5">
       <label for="5">5</label>

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
    $('main').html(generateNewBookmarkView());
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
    const newDesc = $('#link-desc').val();
    const newRating = $('input:radio[name=rating]:checked').val();

    api.createBookmark(newTitle, newUrl, newDesc, newRating)
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

const handleExpandedView = function () {
  $('main').on('click', '#expand', event => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    const bookmark = store.findById(id);
    $('main').html(generateExpandedBookmarkElement(bookmark));
  });
};

const handleCondenseExpandedView = function () {
  $('main').on('click', '#condense', event => {
    event.preventDefault();
    render();
  });
};

/******************* HELPER FUNCTIONS  ************************/
const getBookmarkIdFromElement = function (bookmark) {
  return $(bookmark).closest('.bookmark-list-item').data('item-id');
};

const generateRatingStars = function (bookmark) {
  let rating = '';
  switch (bookmark.rating) {
    case 5:
      rating = '★★★★★';
      break;
    case 4:
      rating = '★★★★☆';
      break;
    case 3:
      rating = '★★★☆☆';
      break;
    case 2:
      rating = '★★☆☆☆';
      break;
    case 1:
      rating = '★☆☆☆☆';
      break;
    default:
      rating = '☆☆☆☆☆';
  }
  return rating;
};

/******************* RENDER FUNCTIONS  ************************/
//Main render function
const render = function () {
  renderError();
  defaultView();
};

//Default view
const defaultView = function () {
  let bookmarks = [...store.bookmarks];
  // insert that HTML into the DOM
  $('main').html(generateDefaultView() + generateBookmarkItemsString(bookmarks));
};

const generateBookmarkItemsString = function (bookmarkList) {
  const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
  return bookmarks.join('');
};

const eventListeners = function () {
  handleNewBookmarkView();
  cancelNewBookmarkView();
  handleNewBookmarkSubmit();
  handleExpandedView();
  handleCondenseExpandedView();
};


export default {
  render,
  eventListeners
};