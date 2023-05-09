// Global Variables
const searchBox = document.getElementById("searchBox");
const magnifier = document.getElementById("magnifier");
const idField = document.getElementById("pokeId");
const pokeNameField = document.getElementById("pokeName");
const pokeTypeField = document.getElementById("pokeType");
const suggestionsList = document.getElementById("suggestions");
const weightPoints = document.getElementById("weightPoints");
const hpPoints = document.getElementById("hpPoints");
const store = document.querySelector(":root");
const abilitiesField = document.getElementById("abilities");
const attackPoints = document.getElementById("attackPoints");
const specialAttackPoints = document.getElementById("specialAttackPoints");
const defensePoints = document.getElementById("defensePoints");
const specialDefensePoints = document.getElementById("specialDefensePoints");
const speedPoints = document.getElementById("speedPoints");
const pokeContentWrapper = document.getElementById("pokeContent");
const titleScreenWrapper = document.getElementById("titleScreen");
const pokeImg = document.getElementById("pokeImg");
let isTitleScreen = true;
let searchShowed = false;
let pokeNamesSuggestions = [];

const typeColor = {
  electric: "linear-gradient(0deg, rgb(193 193 193) 0%, rgb(234 235 43) 100%)",
  fire: "linear-gradient(0deg, rgb(152 152 152) 0%, rgb(250 186 108) 100%)",
  normal: "linear-gradient(0deg, rgb(147 147 147) 0%, rgb(241 241 241) 100%)",
  grass: "linear-gradient(0deg, rgb(177 177 177) 0%, rgb(182 255 177) 100%)",
  water: "linear-gradient(0deg, rgb(217 217 217) 0%, rgb(155 192 255) 100%)",
  flying: "linear-gradient(0deg, rgb(185 185 185) 0%, rgb(194 239 255) 100%)",
  fighting: "linear-gradient(0deg, rgb(167 167 167) 0%, rgb(229 197 91) 100%)",
  poison: "linear-gradient(0deg, rgb(161 161 161) 0%, rgb(255 189 242) 100%)",
  ground: "linear-gradient(0deg, rgb(124 124 124) 0%, rgb(181 166 134) 100%)",
  rock: "linear-gradient(0deg, rgb(102 102 102) 0%, rgb(235 205 137) 100%)",
  psychic: "linear-gradient(0deg, rgb(104 104 104) 0%, rgb(233 182 253) 100%)",
  ice: "linear-gradient(0deg, rgb(135 135 135) 0%, rgb(180 242 255) 100%)",
  bug: "linear-gradient(0deg, rgb(80 80 80) 0%, rgb(184 255 223) 100%)",
  ghost: "linear-gradient(0deg, rgb(145 145 145) 0%, rgb(118 78 114) 100%)",
  steel: "linear-gradient(0deg, rgb(141 141 141) 0%, rgb(233 233 233) 100%)",
  dragon: "linear-gradient(0deg, rgb(124 124 124) 0%, rgb(255 135 175) 100%)",
  dark: "linear-gradient(0deg, rgb(86 86 86) 0%, rgb(203 203 203) 100%)",
  fairy: "linear-gradient(0deg, rgb(149 149 149) 0%, rgb(253 195 255) 100%)",
};

async function init() {
  let pokeList = await getPokemonList();
}

function titleScreen() {
  if (isTitleScreen) {
    titleScreenWrapper.classList.add("d-none");
    pokeContentWrapper.classList.remove("d-none");
  }
  return 0;
}

async function createContent(pokemon) {
  let pokeId = await pokemon["id"];
  pokeId = convertId(String(pokeId));
  titleScreen();
  idField.innerText = `# ${pokeId}`;
  checkPokeType(pokemon["types"][0]["type"]["name"]);
  pokeNameField.innerText = pokemon["name"];
  pokeTypeField.innerText = createTypeList(pokemon["types"]);
  pokeImg.setAttribute(
    "src",
    pokemon["sprites"]["other"]["official-artwork"]["front_default"]
  );
  weightPoints.innerText = pokemon["weight"];
  let abilities = createAbilityList(pokemon["abilities"]);
  abilitiesField.innerText = abilities;
  createStats(pokemon["stats"]);
}

function createStats(stats) {
  hpPoints.innerText = stats[0]["base_stat"];
  attackPoints.innerText = stats[1]["base_stat"];
  defensePoints.innerText = stats[2]["base_stat"];
  specialAttackPoints.innerText = stats[3]["base_stat"];
  specialDefensePoints.innerText = stats[4]["base_stat"];
  speedPoints.innerText = stats[5]["base_stat"];
}

function createTypeList(typeList) {
  let types = [];
  typeList.forEach((type) => {
    types.push(type["type"]["name"]);
  });
  for (let i = 0; i < types.length; i++) {
    types[i] = types[i].charAt(0).toUpperCase() + types[i].substr(1);
  }
  return types.join(" | ");
}

function createAbilityList(abilityList) {
  let abilityListFinal = [];
  abilityList.forEach((ability) => {
    abilityListFinal.push(ability["ability"]["name"]);
  });
  for (let i = 0; i < abilityListFinal.length; i++) {
    abilityListFinal[i] =
      abilityListFinal[i].charAt(0).toUpperCase() +
      abilityListFinal[i].substr(1);
  }
  return abilityListFinal.join(" | ");
}

function loadSearchBox() {
  if (!searchShowed) {
    magnifier.classList.add("switch-magnifier");
    searchBox.classList.add("show-search-box");

    magnifier.classList.remove("close-search");
    searchBox.classList.remove("hide-search-box");
    searchShowed = true;
    return;
  }
  if (searchShowed) {
    magnifier.classList.remove("switch-magnifier");
    searchBox.classList.remove("show-search-box");

    magnifier.classList.add("close-search");
    searchBox.classList.add("hide-search-box");
    searchBox.value = "";
    searchShowed = false;
    return;
  }
}

function checkPokeType(pokeType) {
  if (pokeType) {
    let color = typeColor[pokeType];
    store.style.setProperty("--bg-color-type", typeColor[pokeType]);
  }
}

async function searchPokemon(searchQuery) {
  try {
    let url = `https://pokeapi.co/api/v2/pokemon/${searchQuery}`;
    let response = await fetch(url);

    if (response.ok) {
      let responseAsJSON = await response.json();
      createContent(responseAsJSON);
      return responseAsJSON;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getPokemonList() {
  const pokeListUrl = "https://pokeapi.co/api/v2/pokemon?limit=99999&offset=0";
  const pokeList = await fetch(pokeListUrl);
  pokeListAsJSON = await pokeList.json();
  addSuggestions(pokeListAsJSON);
  return pokeListAsJSON;
}

function addSuggestions(pokeList) {
  for (let i = 0; i < pokeList["results"].length; i++) {
    pokeNamesSuggestions.push(pokeList["results"][i]["name"]);
  }
}

function filterPokemonList(query) {
  let list = [];
  list.push(
    pokeListAsJSON["results"]
      .filter((entry) => entry["name"].includes(query))
      .map((entry) => entry["name"])
  );
  createList(list);
}

function createList(sortedList) {
  listWrapper.innerHTML = "";
  let i = 0;
  sortedList[0].forEach((item) => {
    listWrapper.innerHTML += `<button type="button" id="pokeBtn${i}" onclick="searchPokemon('${makeLowercase(
      item
    )}');" class="btn btn-outline-primary first-letter-uppercase">${item}</button>`;
    i++;
  });
}

function convertId(id) {
  if (id.length == 4) {
    return id;
  }
  if (id.length == 3) {
    return "0" + id;
  }
  if (id.length == 2) {
    return "00" + id;
  }
  if (id.length == 1) {
    return "000" + id;
  }
}

function makeLowercase(string) {
  return string.toLowerCase();
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", init);

magnifier.addEventListener("click", loadSearchBox);

searchBox.addEventListener("input", () => {
  const value = searchBox.value.toLowerCase();

  const matchingSuggestions = pokeNamesSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().startsWith(value)
  );

  const suggestionsHTML = matchingSuggestions
    .map((suggestion) => `<li>${capitalizeFirstLetter(suggestion)}</li>`)
    .join("");

  suggestionsList.innerHTML = suggestionsHTML;
  suggestionsList.style.display = matchingSuggestions.length ? "block" : "none";
});

suggestionsList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    searchBox.value = event.target.innerText;
    searchPokemon(searchBox.value.toLowerCase());

    suggestionsList.style.display = "none";
  }
});

suggestionsList.addEventListener("mouseover", (event) => {
  if (event.target.tagName === "LI") {
    Array.from(suggestionsList.children).forEach((child) => {
      child.classList.remove("active");
    });

    event.target.classList.add("active");
  }
});

suggestionsList.addEventListener("mouseout", (event) => {
  if (event.target.tagName === "LI") {
    event.target.classList.remove("active");
  }
});
