var movieData;
var currentPage = 1;
var likedMovies = [];
var genreNames;
var selected;

var genreColors = ["crimson", "brown",
              "darkorange", "gold",
              "firebrick", "floralwhite",
              "lightgreen", "lightsalmon",
              "mediumslateblue", "moccasin",
              "black", "deeppink",
              "darkslategray", "hotpink",
              "lightgreen", "steelblue",
              "midnightblue", "maroon",
              "indigo"];


// -----------------------------Modal---------------------------------

const fetchGenres = () => {
  fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=fa022e657f5520259f5b21f9a8fccd67')
  .then(res => res.json())
  .then(data => {
    genreNames = data.genres
    genreNames.forEach((element, index) => {
      element.color = genreColors[index]
    })
  })
  .catch(err => console.log(err))
}


const getGenres = (genreIndex) => {
  var namesAndColors = []

  //console.log("genreNames")
  //console.log(genreNames)
  genreIndex.forEach(id => {
    //console.log(id)    
    var target = genreNames.find(element => {
                  return id === element.id
               })
    namesAndColors.push({name: target.name, color: target.color})
  })
  return namesAndColors
} 


const imgOnClick = (element) => {
  var baseImgUrl = "https://image.tmdb.org/t/p/w500"

  var target = movieData.results.find(value => {
    let path = value.poster_path
    path = "".concat(baseImgUrl, value.poster_path)
    //console.log(path)
    return path === element.src
  })

  
  var bgModalImgPath = "".concat(baseImgUrl, target.backdrop_path)

  document.getElementById("modalImg").src = element.src
  document.getElementById("bgBlur").style.display = "block"
  document.getElementById("modal").style.backgroundImage = `url(${bgModalImgPath})`

  document.getElementById("modalDescriptionTitle").innerHTML = 
      `${target.original_title} (${target.release_date.substr(0,4)})`
  
  var genres = getGenres(target.genre_ids)
  var genresStr = ""
  for (let i = 0; i < genres.length; i++){
    genresStr = genresStr + `<span 
                              style="background: ${genres[i].color}"
                            >` + genres[i].name + " </span>"
  }

  document.getElementById("modalDescriptionTags").innerHTML = genresStr
  document.getElementById("modalDescriptionParagraph").innerHTML = target.overview

  var baseUrl = "https://api.themoviedb.org/3/movie/"
  var api_key = 'fa022e657f5520259f5b21f9a8fccd67'
  var path = "".concat(baseUrl, target.id, "?api_key=", api_key)
  fetch(path)
  .then(res => res.json())
  .then(data => {
    var publisherHTML = ""
    var companies = data.production_companies
    companies.forEach(element => {
      if (element.logo_path === null){
        publisherHTML += `<span>${element.name}</span>`
      }
      else{
        let logoPath = baseImgUrl
        logoPath = baseImgUrl + element.logo_path
        publisherHTML += `<img src=${logoPath} alt="logoImg" height="30px"/>`
      }
    })
    document.getElementById("modalDescriptionPublisher").innerHTML = publisherHTML
  })

  //console.log(document.getElementById("modal").display)
}



const closeModal = () => {
  document.getElementById("bgBlur").style.display = "none"
}


// ---------------------------------Liked List-------------------------------




const getLikedMovies = () => {
  document.getElementsByTagName("nav")[0].style.display = "none"
  document.getElementsByClassName("navDiv")[0].style.display = "none"
  document.getElementById("config").style.display = "inline-block"

  var baseImgUrl = "https://image.tmdb.org/t/p/w500"

  //console.log(likedMovies)
  var mainElement = document.getElementsByTagName("main")[0]
  var imgUrl
  var cardHTML = ""

  var baseUrl = "https://api.themoviedb.org/3/movie/"
  var api_key = 'fa022e657f5520259f5b21f9a8fccd67'

  var path = []

  likedMovies.forEach(element => {
    path.push("".concat(baseUrl, element, "?api_key=", api_key))
  })


  mainElement.innerHTML = ""

  path.forEach(element => {
    fetch(element)
    .then(res => res.json())
    .then(res => {
      imgUrl = "".concat(baseImgUrl, res.poster_path)
      var imgId = res.id

      cardHTML = ""

      cardHTML += "<div class='mainCards'>"
      cardHTML += `<div class='imgWrapper'>
                  <img 
                    class="mainImgs" 
                    src=${imgUrl} 
                    alt="img" 
                    width="200px"
                    style="cursor:pointer"
                    onclick="imgOnClick(this)"
                  />
                  </div>`
      cardHTML += `<p class="mainTitles">${res.title}</p>`
      cardHTML += `<p class="mainDates">${res.release_date}</p>`
      cardHTML += "</div>"
      mainElement.innerHTML += cardHTML 
    })
    .catch(err => console.log(err))
  })
 
}




const showLikedList = () => {
  if (likedMovies.length > 0){
    document.getElementById("likedList").style.display = "inline-block"
  }
}



const likeMovie = (movie) => {
  var location = likedMovies.findIndex(element => {
    return element === movie.dataset.imgid
  })
  if (location === -1) {
    likedMovies.push(movie.dataset.imgid)
  }
  showLikedList()
} 



// ---------------------------------Load Movies---------------------------


const showMovieData = (data) => {
  var baseImgUrl = "https://image.tmdb.org/t/p/w500"

  //console.log(data)
  var mainElement = document.getElementsByTagName("main")[0]
  var imgUrl
  var cardHTML = ""

  data.forEach(element => {
    //console.log(element)
    imgUrl = "".concat(baseImgUrl, element.poster_path)
    var imgId = element.id

    cardHTML += "<div class='mainCards'>"
    cardHTML += `<div class='imgWrapper'>
                <img 
                  class="mainImgs" 
                  src=${imgUrl} 
                  alt="img" 
                  width="200px"
                  style="cursor:pointer"
                  onclick="imgOnClick(this)"
                />
                <div class='likeImg' onclick='likeMovie(this)' data-imgid=${imgId}>
                    Like
                </div>
                </div>`
    cardHTML += `<p class="mainTitles">${element.title}</p>`
    cardHTML += `<p class="mainDates">${element.release_date}</p>`
    cardHTML += "</div>"
  });

  mainElement.innerHTML = cardHTML
}



const getMovieData = (page = currentPage) => {
  //console.log(document.querySelector('nav'))
  if (document.querySelector('nav') !== null){
    document.querySelector("nav").style.display = "flex"
  }
  if (document.getElementsByClassName("navDiv") !== "undefined"){
    document.getElementsByClassName("navDiv")[0].style.display = "block"
  }
  document.getElementById("config").style.display = "none"

  var baseUrl = 'https://api.themoviedb.org/3/'
  var api_key = 'fa022e657f5520259f5b21f9a8fccd67'

  var url = "".concat(baseUrl, 'discover/movie?sort_by=popularity.desc&api_key=', api_key, '&page=', page)
  fetch(url)
  .then(res => res.json())
  .then(data => movieData = data)
  //.then(() => console.log(movieData))
  .then(() => {
    var spanElement = document.getElementsByClassName('titleSpan')[0]
    spanElement.innerHTML = "&nbsp Page " + movieData.page + 
                            " / Total " + movieData.total_pages + 
                            " pages from " + movieData.total_results + " results &nbsp"
    showMovieData(movieData.results)
  })
  .catch(err => console.log(err))
};


// ------------------------------------Switch Pages------------------------------


const addPage = () => {
  if (currentPage < movieData.total_pages) {
    currentPage += 1
    document.getElementById("nextBtn").removeAttribute("disabled")
    document.getElementById("prevBtn").removeAttribute("disabled")
    getMovieData(currentPage)
    if (currentPage == movieData.total_pages) document.getElementById("nextBtn").setAttribute("disabled", "true")
  }
}

const minusPage = () => {
  if (currentPage > 1) {
    currentPage -= 1
    document.getElementById("prevBtn").removeAttribute("disabled")
    document.getElementById("nextBtn").removeAttribute("disabled")
    getMovieData(currentPage)
    if (currentPage == 1) document.getElementById("prevBtn").setAttribute("disabled", "true")
  }
}


// -----------------------------Config--------------------------------
const openConfig = () => {
  document.getElementById("configBgBlur").style.display = "block"
  
  var configContent = document.getElementById("configModalContent")
  var baseImgUrl = "https://image.tmdb.org/t/p/w500"
  var imgUrl

  var baseUrl = "https://api.themoviedb.org/3/movie/"
  var api_key = 'fa022e657f5520259f5b21f9a8fccd67'

  var path = []

  configContent.innerHTML = "<ul>"
  var entryHTML = ""

  likedMovies.forEach(element => {
    path.push("".concat(baseUrl, element, "?api_key=", api_key))
  })

  path.forEach(element => {
    fetch(element)
    .then(res => res.json())
    .then(res => {
      imgUrl = "".concat(baseImgUrl, res.poster_path)

      entryHTML = ""
      entryHTML += `<li class="entry" 
                      draggable="true"
                      ondragstart="dragStart(event)" 
                      ondragover="dragOver(event)" 
                      ondragend="dragEnd(event)"
                      data-titleid=${res.id}>${res.title}</li>`
      configContent.innerHTML += entryHTML
    })
    .then(() => configContent.innerHTML += "</ul>")
    .catch(err => console.log(err))
  })
}

const closeConfigModal = () => {
  document.getElementById("configBgBlur").style.display = "none"
  likedMovies = []
  var entries = document.getElementsByClassName("entry")
  //console.log(entries)
  for (let i = 0; i < entries.length; i++){
    //console.log(entries[i].dataset.titleid)
    likedMovies.push(entries[i].dataset.titleid)
  }

  getLikedMovies()
}




const dragOver = (e) => {
  //e.preventDefault()
  if ( isBefore( selected, e.target ) ) e.target.parentNode.insertBefore( selected, e.target )
  else e.target.parentNode.insertBefore( selected, e.target.nextSibling )
}

const dragEnd = (e) => {
  //e.preventDefault()
  selected = null
}

const dragStart = (e) => {
  e.dataTransfer.effectAllowed = "move"
  e.dataTransfer.setData( "text/plain", null )
  selected = e.target
  //console.log(selected)
}

const isBefore = (el1, el2) => {
  var cur
  if ( el2.parentNode === el1.parentNode ) {
    for ( cur = el1.previousSibling; cur; cur = cur.previousSibling ) {
      if (cur === el2) return true
    }
  } else return false;
}