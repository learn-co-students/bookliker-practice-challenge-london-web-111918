const ulEl = document.querySelector('#list')
const panelEl = document.querySelector('#show-panel')

function fetchBooks(){
  return fetch('http://localhost:3000/books')
    .then(resp => resp.json())
}

function parseBooks(){
  fetchBooks().then(data => {
    data.forEach(book => appendList(book))
  })
}


function appendList(book) {
  const bookItem = document.createElement('li')
  bookItem.innerHTML = book.title
  bookItem.addEventListener('click', () => displayBookInfo(book))

  ulEl.appendChild(bookItem)
}

function displayBookInfo(book){
  const likeBtn = document.createElement('button')
  likeBtn.innerHTML = "Like"
  panelEl.innerHTML = ""
  panelEl.innerHTML = `
    <h2>${book.title}</h2>
    <img src="${book.img_url}">
    <p>${book.description}</p>
    <h3>Likes</h3>
    `

  panelEl.appendChild(likesFromUsers(book))
  panelEl.appendChild(likeBtn)
  likeBtn.addEventListener('click', () => updateBookLikes(book))
}

function likesFromUsers(book) {
  const addUl = document.createElement('ul')
  addUl.innerHTML = ''
  book.users.forEach(user => {
    const addLi = document.createElement('li')
    addLi.innerHTML = user.username
    addUl.appendChild(addLi)
  })
  return addUl
}

function updateBookLikes(book) {
  const user = {id: 1, username: "pouros"}
  if (book.users.filter(u => u.id === user.id).length === 0) {
    book.users.push(user)
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({users: book.users})
    })
    displayBookInfo(book)
  }
}

parseBooks()
