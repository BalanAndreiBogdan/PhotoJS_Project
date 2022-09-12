//codul din Pexels pt API
const auth = "563492ad6f917000010000012dbe7c12a3bd425bb9b52b4796933c7a";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
let searchValue;
const more = document.querySelector(".more");
let page = 1;
let fetchLink;
let currentSearch;

//Event Listeners
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  //adaugam pentru ca onclick  pagina isi da refersh
  e.preventDefault();
  //pentru a vedea daca am cautat deja ceva
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

more.addEventListener("click", loadMore);

//Updatam valoarea in functie de ce este in search
function updateInput(e) {
  searchValue = e.target.value;
}

//O functie ce returneaza datele din API in format JSON
async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

//Pentru fiecare poza creem un div si il "lipim" la gallery
function generatePictures(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
            <div class="gallery-info">
            <p>${photo.photographer}</p>
            <a href=${photo.src.original}>Download</a>
            </div>
            <img src=${photo.src.large}></img>
            `;
    gallery.appendChild(galleryImg);
  });
}

//Preluam datele din API si generam pozele
async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
  const data = await fetchApi(fetchLink);

  generatePictures(data);
}

//Preluam datele din API dar in functie de ce scriem in search
async function searchPhotos(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

function clear() {
  //curata pagina
  gallery.innerHTML = "";
  //curata inputul
  searchInput.value = "";
}

//Pentru butonul de More
async function loadMore() {
  page++;
  //poze specifice dupa search
  //query e curatat de asta am pus currentSearch
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
  }
  //poze random
  else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

curatedPhotos();
