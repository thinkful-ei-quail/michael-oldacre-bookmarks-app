import $ from 'jquery';


const STORE = {
  bookmarks: [
    {
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
    },
    {
      id: '7ddr',
      title: 'Title 11',
      rating: 5,
      url: 'http://www.title11.com',
      description: 'lorem ipsum dolor',
      expanded: true
    }
  ],
  adding: false,
  error: null,
  filter: 0
};

/************ GENERATOR FUNCTIONS **************/
function generateCondensedBookmark(item, index, template) {
  return `<li></li>`;
}

/************ RENDER FUNCTIONS **************/
function renderBookmarkList() {
  console.log('\'renderBookmarkList\' ran');
  const condensedBookmarkItemString = condensedBookmarkItem();
  $('.bookmark-list').html(condensedBookmarkItemString);
}

function detailedBookmarkView() {
  console.log('\'detailedBookmakView\' ran');
}

function addingNewBookmarkView() {
  console.log('\'newBookmarkView\' ran');
}

function condensedBookmarkItem() {
  console.log('\'condensedBookmarkItem\' ran');

  //const items = bookmarksStore.map((item, index) => generateCondensedBookmark(item, index));

  return `<li>${STORE.bookmarks[0].title}</li>`;
  /* return `<li class="bookmark-list-item">
  <form><span>Test 1</span>

    <input name="one-star" class="rating" type="checkbox" id="one-star">
     <label for="one-star"></label>

    <input name="two-star" class="rating" type="checkbox" id="two-star">
     <label for="two-star"></label>

    <input name="three-star" class="rating" type="checkbox" id="three-star">
     <label for="three-star"></label>

      <input name="four-star" class="rating" type="checkbox" id="four-star">
     <label for="four-star"></label>

      <input name="five-star" class="rating" type="checkbox" id="five-star">
     <label for="five-star"></label>
     
   </form></li>`; */
}

function expandedBookmarkItem() {
  console.log('\'expandedBookmarkItem\' ran');
}

/************ ACTION FUNCTIONS **************/

function addBookmarkItem() {
  console.log('\'addBookmarkItem\' ran');
}

function removeBookmarkItem() {
  console.log('\'removeBookmarkItem\' ran');
}

/************ EVENT HANDLERS **************/


/************ RENDER INITIAL VIEW **************/
function handleBookmarkList() {
  renderBookmarkList();
  detailedBookmarkView();
  addingNewBookmarkView();
  condensedBookmarkItem();
  expandedBookmarkItem();
  addBookmarkItem();
  removeBookmarkItem();

}


$(handleBookmarkList);