const url = getUrlFromId(82);
let allEpisodes = [];

const searchInput = document.getElementById("search-input");
const selectEpisode = document.getElementById("select-episode");
const selectShow = document.getElementById("select-show");

//You can edit ALL of the code here
// function setup() {
//   fetch(url)
//     .then((res) => res.json())
//     .then((data) => {
//       // in here we can do whatever we want with the data
//       allEpisodes = data;
//       makePageForEpisodes(allEpisodes);
//     })
//     .catch((err) => console.error(err));
// }


async function setup() {
  makeShowDropdownItems();
  try {
    const res = await fetch(url);
    const data = await res.json();

    allEpisodes = data;
    makePageForEpisodes(allEpisodes);
  } catch (err) {
    console.error(err);
  }
}

function makePageForEpisodes(episodeList) {
  const root = document.getElementById("root");

  clearElement(root);
  clearElement(selectEpisode);

  makeEpisodeCount(root, episodeList);

  episodeList.forEach((episode) => {
    // add the season and episode and name
    makeEpisodeTitle(root, episode);

    // add the image
    makeEpisodeImage(root, episode);

    // add the summary paragraph nb the episode.summary is actually HTML
    makeEpisodeSummary(root, episode);

    // also, one more thing, add it to the select element as an option
    makeEpisodeDropdownItem(selectEpisode, episode);
  });
}

/**
 * EVENT LISTENERS
 */
searchInput.addEventListener("input", (e) => {
  const searchString = e.target.value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter((episode) => {
    // localeCompare might be neater here
    return (
      episode.summary.toLowerCase().includes(searchString) ||
      episode.name.toLowerCase().includes(searchString)
    );
  });
  makePageForEpisodes(filteredEpisodes);
});

selectEpisode.addEventListener("change", (e) => {
  // we now have shown that e.target.value === the episode id that has been clicked on
  const idSelectedByUser = Number(e.target.value);
  const selectedEpisode = allEpisodes.find((ep) => ep.id === idSelectedByUser);
  if (selectedEpisode) {
    makePageForEpisodes([selectedEpisode]);
  }
});

selectShow.addEventListener("change", async (e) => {
  const showIdSelectedByUser = Number(e.target.value);
  const nextFetchUrl = getUrlFromId(showIdSelectedByUser);
  try {
    const res = await fetch(nextFetchUrl);
    const data = await res.json();

    allEpisodes = data;
    makePageForEpisodes(allEpisodes);
  } catch (err) {
    console.error(err);
  }
  // <<< TODO
  // refactor the repeated code in the fetch request above
  // make sure the list is sorted alphabetically
  // also we have a bug when the page loads, always shows GoT!
  // put all the helpers into another file and load it in the HTML
  searchInput.value = "";
});

window.onload = setup;

/**
 * HELPER FUNCTIONS
 */
function clearElement(el) {
  el.innerHTML = "";
}

function makeEpisodeCount(el, list) {
  const countParagraph = document.createElement("p");
  countParagraph.innerText = `Showing ${list.length} episodes`;
  el.appendChild(countParagraph);
}

function makeEpisodeTitle(el, episode) {
  const paragraph = document.createElement("p");
  paragraph.textContent = `${makeSeasonAndEpisode(episode)}: ${episode.name}`;
  el.appendChild(paragraph);
}

function makeEpisodeImage(el, episode) {
  const image = document.createElement("img");
  image.src = episode.image.medium;
  el.appendChild(image);
}

function makeEpisodeSummary(el, episode) {
  el.innerHTML += episode.summary;
}

function makeEpisodeDropdownItem(el, episode) {
  const option = document.createElement("option");
  option.textContent = `${makeSeasonAndEpisode(episode)} - ${episode.name}`;
  option.value = episode.id;
  el.appendChild(option);
}

function makeSeasonAndEpisode(episode) {
  const { season, number } = episode;
  const paddedSeason = season.toString().padStart(2, "0");
  const paddedEpisode = number.toString().padStart(2, "0");

  return `S${paddedSeason}E${paddedEpisode}`;
}

function makeShowDropdownItems() {
  const allShows = getAllShows();
  allShows.forEach((show) => {
    const option = document.createElement("option");
    option.textContent = show.name;
    option.value = show.id;
    selectShow.appendChild(option);
  });
}

function getUrlFromId(id) {
  return `https://api.tvmaze.com/shows/${id}/episodes`;
}