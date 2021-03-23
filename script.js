function onLoad() {
  selectShows();
}

function selectShows() {
  const allShows = getAllShows();
  const dropdownShowMenu = document.querySelector(".show-select");
  const sortedAllShows = allShows.map(show => show.name).sort();
  console.log(sortedAllShows)
  allShows.forEach(show => {
    dropdownShowMenu.innerHTML += `
    <option class="show-option" value="${show.id}">${show.name}</option>
  `
  })

  dropdownShowMenu.addEventListener("change", (e) => {
    const wrapper = document.querySelector("#wrapper");
    wrapper.innerHTML = "";
    const countEpisodes = document.querySelector(".search-result");
    const dropdownEpisodeMenu = document.querySelector(".episode-select");
    dropdownEpisodeMenu.innerHTML = `<option class="episode-option" value="">All Episodes</option>`
    const dropdownShowMenuValue = e.currentTarget.value;
    if (dropdownShowMenuValue) {
      const selectedUrl = `https://api.tvmaze.com/shows/${dropdownShowMenuValue}/episodes`
      getData(selectedUrl);
    } else {
      wrapper.innerHTML = "";
      countEpisodes.innerText = "";
    }
  })
}

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

function makePageForEpisodes(episodeList) {
  // Selectors
  const wrapper = document.querySelector("#wrapper");
  const dropdownEpisodeMenu = document.querySelector(".episode-select");
  let searchField = document.querySelector(".search");
  const countEpisodes = document.querySelector(".search-result");
  countEpisodes.innerText = `Display ${episodeList.length} of ${episodeList.length} episode(s)`;

  // Show default Display
  episodeList.forEach(episode => {
    const episodeSeason = `${episode.season > 9 ? episode.season : "0" + episode.season}`;
    const episodeNumber = `${episode.number > 9 ? episode.number : "0" + episode.number}`;
    const episodeTitle = `${episode.name} - S${episodeSeason}E${episodeNumber}`;
    wrapper.innerHTML += `
        <div class="col card-wrapper">
          <div class="card bg-light p-3 h-100 pt-3">
            <div class="card">
              <h5 class="card-title title d-flex justify-content-center text-center">${episodeTitle}</h5>
            </div>
            <img src="${episode.image.medium}" class="img mb-2 mt-2 px-3" alt="${episode.name}" />
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

  // Events
  searchField.addEventListener("input", searchEpisodes);
  dropdownEpisodeMenu.addEventListener("change", searchDropdown);
  searchField.addEventListener("click", resetSearch);

  // Functions
  function searchEpisodes() {
    const searchFieldValue = searchField.value;
    let value = searchFieldValue.toLowerCase();
    search(value);
  }

  function searchDropdown(e) {
    searchField.value = "";
    const dropdownEpisodeMenuVale = e.currentTarget.value;
    let value = dropdownEpisodeMenuVale.toLowerCase();
    search(value);
  }

  function search(value) {
    countEpisodes.innerText = "";
    let count = 0;
    const allCards = document.querySelectorAll(".card-wrapper");
    allCards.forEach(card => {
      const cardValue = card.textContent.toLowerCase();
      if (cardValue.includes(value)) {
        card.style.display = "";
        count++;
        countEpisodes.innerText = `Display ${count} of ${allCards.length} episode(s)`;
      } else {
        card.style.display = "none";
        countEpisodes.innerText = `Display ${count} of ${allCards.length} episode(s)`;
      }
    })
  }

  function resetSearch() {
    dropdownEpisodeMenu.selectedIndex = 0;
    searchEpisodes();
  }

}

window.onload = onLoad;
