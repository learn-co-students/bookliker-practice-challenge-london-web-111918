document.addEventListener("DOMContentLoaded", function() {
const bookInfo = document.getElementById('#show-panel')
const booksUL = document.getElementById('list')

    const state = {
      books: [],
      users: [],
      selectedBook: null
    }

    function getBooks() {
      return fetch('http://localhost:3000/books')
        .then(res => res.json())
    }

    function getUsers() {
      return fetch('http://localhost:3000/users')
        .then(res => res.json())
    }

    function createBookUL(book) {
      booklist = document.createElement('ul')
      booklist.classList.add('book-ul')
      booklist.innerText = book.title
      booklist.addEventListener('click', () => insertBookInfo(book))
      return booklist
    }

    function insertBookTitles(books) {
      books.forEach(book => insertBookTitle(book))
    }

    function insertBookTitle(book) {
      booksUL.appendChild(createBookUL(book))
    }

    function insertBookInfo(book) {
      state.selectedBook = book
      bookInfo.innerHTML = displayBookInfo(book)
    }

    function displayBookInfo(book){
      const likeBtn = document.createElement('button')
      likeBtn.innerHTML = "Like"
      booksUL.innerHTML = ""
      booksUL.innerHTML =

      `<h2>${book.title}</h2>
      <img src="${book.img_url}">
      <p>${book.description}</p>
      `

      booksUL.appendChild(likesFromUsers(book))
      booksUL.appendChild(likeBtn)
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
      debugger
      const user = {id: 1, username: 'pouros'}
      if (book.users.filter(user => user.id === user.id)) {
        book.users.push(user)
        fetch(`http://localhost:3000/books/${book.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({users: book.users})
        })
      }
    }

    getBooks()
      .then(books => {
        state.books = books
        insertBookTitles(state.books)
      })

    getUsers()
      .then(users => {
        state.users = users
      })

});
