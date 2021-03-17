function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function header() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `
      <div class="container">
        <form class="d-flex col-12 mb-3">
          <select class="episode-select me-5" id="movie" name="movies">     
          </select>
          <input class="me-3 search" type="search" placeholder="Search" aria-label="Search">
          <p class="search-result"></p>
          </form>
      </div>
      <div class="container">
        <div id="wrapper" class="row row-cols-1 row-cols-md-3 g-4">
      </div>`
}

function makePageForEpisodes(episodeList) {
  header();

  const wrapper = document.querySelector("#wrapper");
  const dropdownMenu = document.querySelector(".episode-select");

  episodeList.forEach(episode => {
    const episodeTitleFormat = `${episode.season > 9 ? episode.season : "0" + episode.season}`
    const episodeTitle = `${episode.name} - S${episodeTitleFormat}E${episodeTitleFormat}`
    wrapper.innerHTML += `
        <div class="col card-wrapper">
          <div class="card p-3 h-100 pt-3">
            <div class="card">
              <h5 class="card-title title d-flex justify-content-center text-center">${episodeTitle}</h5>
            </div>
            <img src="${episode.image.medium}" class="img mb-2 mt-2 px-3" alt="${episode.name}" />
            <p class="summary">${episode.summary}</p>
            <a href="${episode.url}">${episode.url}</a>
          </div>
        </div>`

    dropdownMenu.innerHTML += `
          <option class="select-option" value="">${episodeTitle}</option>;
        `
  })

  let searchField = document.querySelector(".search");
  const countEpisodes = document.querySelector(".search-result");
  countEpisodes.innerText = `Display ${episodeList.length} of ${episodeList.length} episodes`;
  searchField.addEventListener("keyup", function () {
    countEpisodes.innerText = "";
    let count = 0;
    let formattedSearch = searchField.value.toLowerCase();
    const allCards = document.querySelectorAll(".card-wrapper")
    allCards.forEach(card => {
      const cardValue = card.textContent.toLowerCase();
      if (cardValue.includes(formattedSearch)) {
        card.style.display = "";
        count++;
        countEpisodes.innerText = `Display ${count} of ${allCards.length} episodes`;
      } else {
        card.style.display = "none";
        countEpisodes.innerText = `Display ${count} of ${allCards.length} episodes`;
      }
    })
  })

}

window.onload = setup;