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


function makeCards(all) {
  const wrapper = document.querySelector("#wrapper");

  all.forEach(card => {
    let { image, id, name, summary, url, rating, genres, status, runtime, season, number } = card;
    const getImage = image !== null ? image.medium : "";

    const episodeSeason = `${season > 9 ? season : "0" + season}`;
    const episodeNumber = `${number > 9 ? number : "0" + number}`;
    const episodeTitle = `${name} - S${episodeSeason}E${episodeNumber}`;
    const title = season === undefined && number === undefined ? name : episodeTitle

    const cardWrapper = document.createElement("div");
    cardWrapper.setAttribute("class", "col card-wrapper");

    const cardContainer = document.createElement("div");
    cardContainer.setAttribute("class", "card card-container bg-light p-3 h-100 pt-3");

    const cardTitleContainer = document.createElement("div");
    cardTitleContainer.setAttribute("class", "card");

    const cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title title d-flex justify-content-center text-center data-id");
    cardTitle.dataset.id = id;
    cardTitle.innerText = title;
    cardTitleContainer.appendChild(cardTitle);

    const cardImage = document.createElement("img");
    cardImage.src = getImage;
    cardImage.setAttribute("class", "img mb-2 mt-2 px-3");

    const cardSummary = document.createElement("div");
    cardSummary.innerHTML = summary;

    const showDetails = document.createElement("a");
    showDetails.href = url;
    showDetails.innerText = "See Details";

    cardContainer.append(cardTitleContainer, cardImage, cardSummary, showDetails);
    cardWrapper.appendChild(cardContainer);
    wrapper.appendChild(cardWrapper);

    const cardDetails = document.createElement("div");
    cardDetails.setAttribute("class", "card card-details px-2 pt-2 mb-2 mt-3");

    const getRating = rating !== undefined ? rating.average : "";
    const showRating = document.createElement("p");
    showRating.innerHTML = `<span class="text-bold">Rating :</span> ${getRating}`;

    const showGenres = document.createElement("p");
    showGenres.innerHTML = `<span class="text-bold">Genres :</span> ${genres}`;

    const showStatus = document.createElement("p");
    showStatus.innerHTML = `<span class="text-bold">Status :</span> ${status}`;

    const showRuntime = document.createElement("p");
    showRuntime.innerHTML = `<span class="text-bold">Runtime :</span> ${runtime}`;

    cardDetails.append(showRating, showGenres, showStatus, showRuntime);
    cardContainer.appendChild(cardDetails);
  })
}


function makePageForShows(allShows) {
  makeCards(allShows);
  makeHeaderLink();
  countShowsOrEpisodes(allShows);
  makeSearch();

  const dropdownEpisodeMenu = document.querySelector(".episode-select");
  dropdownEpisodeMenu.style.display = "none";
}


function displayAllShows() {
  const showBtn = document.querySelector("button");
  showBtn.addEventListener("click", selectShows);
}


function makeHeaderLink() {
  const title = document.querySelectorAll(".title");
  title.forEach(title => {
    title.addEventListener("click", headerLink)
  })
}


function headerLink(e) {
  const wrapper = document.querySelector("#wrapper");
  wrapper.innerHTML = "";
  let searchField = document.querySelector(".search");
  searchField.value = "";
  const dropdownEpisodeMenu = document.querySelector(".episode-select");
  dropdownEpisodeMenu.style.display = "";

  const dropdownShowMenu = document.querySelector(".show-select");
  const headerTitle = e.currentTarget.innerText;
  let headerTitleIndexArray = [];
  for (show of dropdownShowMenu) {
    headerTitleIndexArray.push(show.innerText)
  }
  const headerTitleIndex = headerTitleIndexArray.indexOf(headerTitle);
  dropdownShowMenu.selectedIndex = headerTitleIndex;

  const currentTitle = e.currentTarget.dataset;
  const currentTitleId = currentTitle.id;
  const headerURL = `https://api.tvmaze.com/shows/${currentTitleId}/episodes`;
  getData(headerURL);
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
      display(content);
    })
    .catch(error => showErrorMessage(error))
}


function showErrorMessage(error) {
  alert(`Encountered something unexpected: ${error}`);
}


function display(content) {
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
  const searchField = document.querySelector(".search");
  searchField.value = "";
  const dropdownEpisodeMenuValue = e.currentTarget.value;
  const value = dropdownEpisodeMenuValue.toLowerCase();
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
      countEpisode.innerText = `Displaying ${count} of ${allCards.length} ${getShowOrEpisode()}(s)`;
    } else {
      card.style.display = "none";
      countEpisode.innerText = `Displaying ${count} of ${allCards.length} ${getShowOrEpisode()}(s)`;
    }
  })
}


function countShowsOrEpisodes(episodeList) {
  const countEpisode = document.querySelector(".search-result");
  countEpisode.innerText = `Displaying ${episodeList.length} of ${episodeList.length} ${getShowOrEpisode()}(s)`;
}


function getShowOrEpisode() {
  const dropdownShowMenu = document.querySelector(".show-select");
  if (dropdownShowMenu.selectedIndex === 0) {
    return "show"
  }
  else return "episode"
}


function getDropdownMenuEpisodeCode(episodeList) {
  const dropdownEpisodeMenu = document.querySelector(".episode-select");
  episodeList.forEach(episode => {
    const { season, number, name } = episode;
    const episodeSeason = `${season > 9 ? season : "0" + season}`;
    const episodeNumber = `${number > 9 ? number : "0" + number}`;
    const episodeTitle = `${name} - S${episodeSeason}E${episodeNumber}`;
    const dropDownEpisodeTitle = `S${episodeSeason}E${episodeNumber} - ${name}`;
    const optionValue = episodeTitle;
    dropdownEpisodeMenu.innerHTML += `
            <option class="episode-option" value="${optionValue}">${dropDownEpisodeTitle}</option>
          `
  })
}


function makePageForEpisodes(episodeList) {
  makeDropdownEpisodeMenu();
  getDropdownMenuEpisodeCode(episodeList);
  makeCards(episodeList);
  removeCardDetails();
  makeSearch();
  countShowsOrEpisodes(episodeList);
}


function removeCardDetails() {
  const cardDetails = document.querySelectorAll(".card-details");
  cardDetails.forEach(card => {
    card.style.display = "none"
  })
}

window.onload = onLoad;
