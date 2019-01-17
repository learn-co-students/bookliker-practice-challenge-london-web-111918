document.addEventListener('DOMContentLoaded', function(){
  function api(){
    return fetch(`http://localhost:3000/books`)
    .then(res => res.json())
  }

  const listEl = document.querySelector('#list')
  const showPanelEl = document.querySelector('#show-panel')
  const userOne = {"id":1, "username":"pouros"}

  function getData(){
    api().then(books => {
      books.forEach((bookhash) => printTitle(bookhash))
    })
  }

  function printTitle(bookhash){
    const book = document.createElement('li')
    book.innerText = `${bookhash.title}`
    listEl.append(book)
    book.addEventListener('click', e => renderInfo(bookhash))
  }

  function renderInfo(bookhash){
    showPanelEl.innerHTML = ""

    const bookImg = document.createElement('img')
    bookImg.src = bookhash.img_url

    const bookDescription = document.createElement('p')
    bookDescription.innerText = bookhash.description

    const likeButton = document.createElement('button')
    likeButton.innerText = `Like (${bookhash.users.length})`

    const listOfUserLikes = document.createElement('ul')
    bookhash.users.forEach((user) => {
      const userInfo = document.createElement('li')
      userInfo.innerText = user.username
      listOfUserLikes.append(userInfo)
    })

    showPanelEl.append(bookImg, bookDescription, likeButton, listOfUserLikes)
    likeButton.addEventListener('click', e => increaseLike(bookhash))
  }

  function increaseLike(bookhash){
    if (bookhash.users.filter((u) => u.id === userOne.id).length === 0){
      bookhash.users.push(userOne)
    }
    fetch(`http://localhost:3000/books/${bookhash.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({users: bookhash.users})
    })
    renderInfo(bookhash)
  }


  getData()
})
