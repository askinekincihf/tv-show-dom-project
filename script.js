//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = `
      <div class="container">
        <div id="wrapper" class="row row-cols-1 row-cols-md-3 g-4">
      </div>`

  const wrapper = document.querySelector("#wrapper");

  episodeList.forEach(episode => {
    wrapper.innerHTML += `
      <div class="col">
        <div class="card p-3 h-100 pt-3">
          <div class="card">
            <h5 class="card-title title d-flex justify-content-center text-center">${episode.name} - S${episode.season > 9 ? episode.season : "0" + episode.season}E${episode.number > 9 ? episode.number : "0" + episode.number}</h5>
          </div>
          <img src="${episode.image.medium}" class="img mb-2 mt-2 px-3" alt="${episode.name}" />
          ${episode.summary}
          <a href="${episode.url}">${episode.url}</a>
        </div>
      </div>
  </div>`
  })

}

window.onload = setup;
