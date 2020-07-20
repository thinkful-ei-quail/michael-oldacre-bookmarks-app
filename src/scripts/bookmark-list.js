import $ from 'jquery';
import api from './api';
import store from './store';


/******************* TEMPLATE FUNCTIONS ************************/
const generateDefaultView = function () {
  return `<form>
<button type="submit" value="Submit" id='new'>New</button>
<label for='filter'>Filter by rating:</label>
<select id="filter" name='filter'>
  <option value="">Select</option>
  <option value="5">5 Star</option>
  <option value="4">4 Star</option>
  <option value="3">3 Star</option>
  <option value="2">2 Star</option>
  <option value="1">1 Star</option>
  <option value="0">Clear</option>
</select>
</form>`;

};

const generateBookmarkElement = function (bookmark) {
  let rating = generateRatingStars(bookmark);

  return `<li class="bookmark-list-item" data-item-id="${bookmark.id}">
  <span>${bookmark.title}</span>
  <button class='item' type="submit" id='expand'>Expand</button>
  <button class='item' type="submit" id='delete'>Delete</button>
  <p>${rating}</p>
</li>`;
};

const generateExpandedBookmarkElementView = function (bookmark) {
  let rating = generateRatingStars(bookmark);

  return `<li class="bookmark-list-item" data-item-id="${bookmark.id}">
  
  <span>${bookmark.title}</span>
  <span>${bookmark.url}</span>
  <button class='item' type="submit" id='condense'>Close</button>
  <button class='item' type="submit" id='delete'>Delete</button>
  <p>${rating}</p>
  <p>${bookmark.desc}</p>


  <div>
      <button class='item' type="submit" id='edit'>Edit</button>
    </div>
  </li>`;
};

const generateEditBookmarkElementView = function (bookmark) {

  return `<h2>Edit Bookmark</h2>
  <li class="bookmark-list-item" data-item-id="${bookmark.id}">
    <form class='edit-bookmark'>
    <label class='item' for="link-title">Title:</label><br>
    <input id="link-title" type="text" name="title" value='${bookmark.title}'>

    <label class='item' for="link-url">Link:</label><br>
    <input id="link-url" type="text" name="url" value='${bookmark.url}' >

    <label class='item' for="link-description">Description:</label>
    <textarea id="link-desc" name="desc">${bookmark.desc}</textarea>

    <h3>Rating:</h3>
      
      <input name="editRating" type="radio" value="1">
       <label for="1">1</label>
      <input name="editRating" type="radio" value="2">
       <label for="2">2</label>
      <input name="editRating" type="radio" value="3">
       <label for="3">3</label>
      <input name="editRating" type="radio" value="4">
       <label for="4">4</label>
      <input name="editRating" type="radio" value="5">
       <label for="5">5</label>

    <button class='item' type="submit" id='cancel'>Cancel</button>
    <button class='item' type="submit" id='update'>Update</button>
  </form>
  </li>`
  ;

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

//Filter bookmarks on default view

const handleFilterView = function () {
  $('main').on('change', '#filter', event => {
    event.preventDefault();
    let filter = parseInt($('option:selected').val());
    let bookmarks = [...store.bookmarks];
    let filterView =[];
    console.log(filter);
    
    if(filter === 0)
    {filterView = bookmarks;}
    else{filterView = bookmarks.filter(bookmark => bookmark.rating === filter);}
          
    console.log(filterView);
    filteredView(filterView);
  });
};

// Delete a bookmark
const handleDeletedBookmarkClick = function () {
  $('main').on('click', '#delete', event => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    api.deleteItem(id).then(() => {
      store.findAndDelete(id);
      defaultView();
    }).catch((error) => {
      console.log(error);
      store.setError(error.message);
      alert(error.message);
      renderError();
    });
  });
};


//Expanded and condensed views
const handleExpandedView = function () {
  $('main').on('click', '#expand', event => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    const bookmark = store.findById(id);
    $('main').html(generateExpandedBookmarkElementView(bookmark));
  });
};

const enableEditView = function () {
  $('main').on('click', '#edit', event => {
    event.preventDefault(); 
    const id = getBookmarkIdFromElement(event.currentTarget);
    const bookmark = store.findById(id);
    $('main').html(generateEditBookmarkElementView(bookmark));
  });
};

const handleEditBookmarkItemSubmit = function () {
  $('main').on('click', '#update', event => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    
    const editTitle = $('#link-title').val();
    const editUrl = $('#link-url').val();
    const editDesc = $('#link-desc').val();
    const editRating = $('input:radio[name=editRating]:checked').val();

    api.updateItem(id, {title: editTitle, url: editUrl, desc: editDesc, rating: editRating})
      .then(() =>{store.findAndUpdate(id, {title: editTitle, url: editUrl, desc: editDesc, rating: editRating});
        render();
      }).catch((error) =>{
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  });
};

const handleCloseExpandedView = function () {
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
  $('option:selected').val('');
  let bookmarks = [...store.bookmarks];
  console.log(bookmarks);
  // insert that HTML into the DOM
  $('main').html(generateDefaultView() + generateBookmarkItemsString(bookmarks));
};

const filteredView = function (bookmarks){
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
  handleCloseExpandedView();
  handleDeletedBookmarkClick();
  enableEditView();
  handleEditBookmarkItemSubmit();
  handleFilterView(); 
  handleCloseError();
};


export default {
  render,
  eventListeners
};