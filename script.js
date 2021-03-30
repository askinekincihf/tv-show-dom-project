function onLoad() {
  selectShows();
}

function selectShows() {
  const allShows = getAllShows();
  const sortedAllShows = allShows.sort(titleCaseInsensitive);
  const dropdownShowMenu = document.querySelector(".show-select");
  sortedAllShows.forEach(show => {
    dropdownShowMenu.innerHTML += `
    <option class="show-option" value="${show.id}">${show.name}</option>
  `
  })

  dropdownShowMenu.addEventListener("change", selectShowsMenu);
  makePageForShows(allShows);
}

function makePageForShows(allShows) {
  countEpisodes(allShows);
  makeSearch();
  const dropdownEpisodeMenu = document.querySelector(".episode-select");
  dropdownEpisodeMenu.style.display = "none";

  const wrapper = document.querySelector("#wrapper");
  allShows.forEach(show => {
    let {image, id, name, summary, rating, genres, status, runtime, url} = show;
    const getImage = image !== null ? image.medium : "";
    wrapper.innerHTML += `
        <div class="col card-wrapper">
          <div class="card bg-light p-3 h-100 pt-3">
            <div class="card">
              <h5 class="card-title title d-flex justify-content-center text-center" data-id="${id}">${name}</h5>
            </div>
            <img src="${getImage}" class="img mb-2 mt-2 px-3" alt="no image found" />
            ${summary}
            <div class="card px-2 pt-2 mb-2">
              <p class="show-detail"><span class="show-detail-bold">Rated:</span> ${rating.average}</p>
              <p class="show-detail"><span class="show-detail-bold">Genres:</span> ${genres}</p>
              <p class="show-detail"><span class="show-detail-bold">Status:</span> ${status}</p>
              <p class="show-detail"><span class="show-detail-bold">Runtime:</span> ${runtime}</p>
            </div>
            <a href="${url}">See Details</a>
          </div>
        </div>`
  })

  makeHeaderLink();
}

function displayAllShows() {
  const showBtn = document.querySelector("button")[0];
  showBtn.addEventListener("click", selectShows);
}

function makeHeaderLink() {
  const title = document.querySelectorAll(".title");
  title.forEach(title => {
    title.addEventListener("click", headerLink)
  })
}

function headerLink(e) {
  const title = e.currentTarget.textContent
  console.log(title)
  const currentTitle = e.currentTarget.dataset;
  const currentTitleId = currentTitle.id;
  const headerURL = `https://api.tvmaze.com/shows/${currentTitleId}/episodes`;
  getData(headerURL);
  const wrapper = document.querySelector("#wrapper");
  wrapper.innerHTML = "";
  let searchField = document.querySelector(".search");
  searchField.value = "";
  const dropdownEpisodeMenu = document.querySelector(".episode-select");
  dropdownEpisodeMenu.style.display = "";
}

function titleCaseInsensitive(showA, showB) {
  let nameA = showA.name.toLowerCase();
  let nameB = showB.name.toLowerCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

function selectShowsMenu(e) {
  let searchField = document.querySelector(".search");
  searchField.value = "";
  const wrapper = document.querySelector("#wrapper");
  wrapper.innerHTML = "";
  const countEpisodes = document.querySelector(".search-result");
  const dropdownEpisodeMenu = document.querySelector(".episode-select");
  const showId = e.currentTarget.value;
  if (showId) {
    const selectedUrl = `https://api.tvmaze.com/shows/${showId}/episodes`
    getData(selectedUrl);
    dropdownEpisodeMenu.innerHTML = `<option class="episode-option" value="">All Episodes</option>`
    dropdownEpisodeMenu.style.display = "";
  } else {
    wrapper.innerHTML = "";
    countEpisodes.innerText = "";
    selectShows();
  }
}

// Fetch the Data
function getData(url) {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Encountered something unexpected: ${response.status} ${response.statusText}`);
      }
    })
    .then((content) => {
      setup(content);
    })
    .catch(error => showErrorMessage(error))
}


function showErrorMessage(error) {
  alert(`Encountered something unexpected: ${error}`);
}


function setup(content) {
  const allEpisodes = content;
  makePageForEpisodes(allEpisodes);
}


function makeSearch() {
  let searchField = document.querySelector(".search");
  searchField.addEventListener("input", searchEpisodes);
  searchField.addEventListener("click", resetSearch);
}


function searchEpisodes() {
  let searchField = document.querySelector(".search");
  const searchFieldValue = searchField.value;
  let value = searchFieldValue.toLowerCase();
  search(value);
}


function resetSearch() {
  const dropdownEpisodeMenu = document.querySelector(".episode-select");
  dropdownEpisodeMenu.selectedIndex = 0;
  searchEpisodes();
}


function makeDropdownEpisodeMenu() {
  const dropdownEpisodeMenu = document.querySelector(".episode-select");
  dropdownEpisodeMenu.addEventListener("change", searchDropdown);
}


function searchDropdown(e) {
  let searchField = document.querySelector(".search");
  searchField.value = "";
  const dropdownEpisodeMenuValue = e.currentTarget.value;
  let value = dropdownEpisodeMenuValue.toLowerCase();
  search(value);
}


function search(value) {
  const countEpisode = document.querySelector(".search-result");
  countEpisode.innerText = "";
  let count = 0;
  const allCards = document.querySelectorAll(".card-wrapper");
  allCards.forEach(card => {
    const cardValue = card.textContent.toLowerCase();
    if (cardValue.includes(value)) {
      card.style.display = "";
      count++;
      countEpisode.innerText = `Display ${count} of ${allCards.length} ${getShowOrEpisode()}(s)`;
    } else {
      card.style.display = "none";
      countEpisode.innerText = `Display ${count} of ${allCards.length} ${getShowOrEpisode()}(s)`;
    }
  })
}

function countEpisodes(episodeList) {
  const countEpisode = document.querySelector(".search-result");
  countEpisode.innerText = `Display ${episodeList.length} of ${episodeList.length} ${getShowOrEpisode()}(s)`;
}

function getShowOrEpisode() {
  const dropdownShowMenu = document.querySelector(".show-select");
  if (dropdownShowMenu.selectedIndex === 0) {
    return "show"
  } else return "episode"
}

function makePageForEpisodes(episodeList) {
  const wrapper = document.querySelector("#wrapper");
  const dropdownEpisodeMenu = document.querySelector(".episode-select");

  episodeList.forEach(episode => {
    let {image, season, number, name, summary, url} = episode;
    const getImage = image !== null ? image.medium : "";
    const episodeSeason = `${season > 9 ? season : "0" + season}`;
    const episodeNumber = `${number > 9 ? number : "0" + number}`;
    const episodeTitle = `${name} - S${episodeSeason}E${episodeNumber}`;
    wrapper.innerHTML += `
        <div class="col card-wrapper">
          <div class="card bg-light p-3 h-100 pt-3">
            <div class="card">
              <h5 class="card-title title d-flex justify-content-center text-center">${episodeTitle}</h5>
            </div>
            <img src="${getImage}" class="img mb-2 mt-2 px-3" alt="no image found" />
            ${summary}
            <a href="${url}">See Details</a>
          </div>
        </div>`

    const dropDownEpisodeTitle = `S${episodeSeason}E${episodeNumber} - ${name}`;
    const optionValue = episodeTitle;
    dropdownEpisodeMenu.innerHTML += `
          <option class="episode-option" value="${optionValue}">${dropDownEpisodeTitle}</option>
        `
  })

  makeDropdownEpisodeMenu();
  makeSearch();
  countEpisodes(episodeList);
}

window.onload = onLoad;
