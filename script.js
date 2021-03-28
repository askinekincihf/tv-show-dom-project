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
    const getImage = show.image !== null ? show.image.medium : "";
    wrapper.innerHTML += `
        <div class="col card-wrapper">
          <div class="card bg-light p-3 h-100 pt-3">
            <div class="card">
              <h5 class="card-title title d-flex justify-content-center text-center" data-id="${show.id}">${show.name}</h5>
            </div>
            <img src="${getImage}" class="img mb-2 mt-2 px-3" alt="no image found" />
            ${show.summary}
            <div class="card px-2 pt-2 mb-2">
              <p class="show-detail"><span class="show-detail-bold">Rated:</span> ${show.rating.average}</p>
              <p class="show-detail"><span class="show-detail-bold">Genres:</span> ${show.genres}</p>
              <p class="show-detail"><span class="show-detail-bold">Status:</span> ${show.status}</p>
              <p class="show-detail"><span class="show-detail-bold">Runtime:</span> ${show.runtime}</p>
            </div>
            <a href="${show.url}">See Details</a>
          </div>
        </div>`
  })

  makeHeaderLink();
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

// Search Input Part
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

// Episode Dropdown Menu
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
  // Selectors
  const wrapper = document.querySelector("#wrapper");
  const dropdownEpisodeMenu = document.querySelector(".episode-select");

  // Show default Display
  episodeList.forEach(episode => {
    const getImage = episode.image !== null ? episode.image.medium : "";
    const episodeSeason = `${episode.season > 9 ? episode.season : "0" + episode.season}`;
    const episodeNumber = `${episode.number > 9 ? episode.number : "0" + episode.number}`;
    const episodeTitle = `${episode.name} - S${episodeSeason}E${episodeNumber}`;
    wrapper.innerHTML += `
        <div class="col card-wrapper">
          <div class="card bg-light p-3 h-100 pt-3">
            <div class="card">
              <h5 class="card-title title d-flex justify-content-center text-center">${episodeTitle}</h5>
            </div>
            <img src="${getImage}" class="img mb-2 mt-2 px-3" alt="no image found" />
            ${episode.summary}
            <a href="${episode.url}">See Details</a>
          </div>
        </div>`

    const dropDownEpisodeTitle = `S${episodeSeason}E${episodeNumber} - ${episode.name}`;
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
