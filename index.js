document.addEventListener("DOMContentLoaded", () => {

const listUl = document.querySelector("#list")
const showPanel = document.querySelector("#show-panel")
let likeList
let likeButton
let result

const state = {
  books: [],
  user: userApiCall(),
  selectedBook: null
}

function bookApiCall () {
  return fetch("http://localhost:3000/books").then(response => response.json())
}

function userApiCall () {
  return fetch("http://localhost:3000/users/1").then(response => response.json()).then(user => state.user = user)
}

function renderBookListItem (book) {
  listUl.innerHTML += `<li data-id=${book.id} >${book.title}</li>`
}

function renderBookListItems (books) {
  books.forEach(renderBookListItem)
}

function getAndRenderBooks() {
  bookApiCall().then(books => {
    state.books = books
    renderBookListItems(state.books)
  })
}

function getBook(event) {
  const result = state.books.find(book => book.id == event.target.dataset.id)
  state.selectedBook = result
  showBook(state.selectedBook)
}

function showBook(book) {
  showPanel.innerHTML = `
    <h2>${book.title}</h2>
    <img src=${book.img_url} >
    <p>${book.description}</p>
    <h4>Likes:</h4>
    <ul id = "like-list"></ul>
    <button id="like-button" data-id=${book.id}>
      ${getLikeButtonText()}
    </button>
  `
  likeList = document.querySelector("#like-list")
  likeButton = document.querySelector("#like-button")
  likeButton.addEventListener('click', likeBook)
  showLikes(book)
}

function getLikeButtonText () {
  return userLikedBook() ? "Unlike this Book" : "Like this Book"
}

function userLikedBook () {
  return !!state.selectedBook.users.find(user => user.id === state.user.id)
}

function likeBook() {
  if (userLikedBook()) {
    const updatedUsers = state.selectedBook.users.filter(user => user.id !== state.user.id)
    state.selectedBook.users = updatedUsers
  } else {
    state.selectedBook.users.push(state.user)
  }
  likeButton.innerText = getLikeButtonText()
  updateBook(state.selectedBook)
    .then(() => showLikes(state.selectedBook))
}

function updateBook(book) {
  return fetch(`http://localhost:3000/books/${book.id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(book)
  }).then(response => response.json())
}

  function showLikes(result) {
    likeList.innerHTML = ""
    result.users.forEach(user => {
      likeList.innerHTML += `<li>${user.username}</li>`
    })
  }

getAndRenderBooks()

listUl.addEventListener('click', getBook)

})
