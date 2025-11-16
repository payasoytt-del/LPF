// main.js
// Archivo central que coordina interacciones entre la galería y el simulador.
// --------------------------------------------------------------------------
// Este script no reemplaza a gallery.js ni simulator.js, sino que actúa
// como "capa de conexión" entre los botones, eventos y lógica general.
// --------------------------------------------------------------------------

console.log("[MAIN] main.js cargado correctamente");

// --- Referencias a elementos del DOM ---
const btnRefresh = document.getElementById("btn-refresh");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sortSelect");
const thumbSize = document.getElementById("thumbSize");

// Galería
const gallery = document.getElementById("gallery");
let allTeams = []; // Se carga una vez y se filtra dinámicamente

// ------------------------------------------------------------
// Función para recargar teams.json manualmente
// ------------------------------------------------------------
btnRefresh?.addEventListener("click", () => {
  loadTeams();
});

// ------------------------------------------------------------
// Cargar equipos desde teams.json
// ------------------------------------------------------------
async function loadTeams() {
  console.log("[MAIN] Cargando equipos...");

  try {
    const res = await fetch("data/teams.json");
    allTeams = await res.json();
    renderTeams(allTeams);
    console.log("[MAIN] Equipos cargados:", allTeams.length);
  } catch (err) {
    console.error("[MAIN] Error al cargar teams.json", err);
  }
}

// ------------------------------------------------------------
// Renderizar los equipos en el DOM
// ------------------------------------------------------------
function renderTeams(list) {
  gallery.innerHTML = "";

  list.forEach(team => {
    const card = document.createElement("div");
    card.className = "team-card";

    const img = document.createElement("img");
    img.src = team.logo;
    img.alt = team.name;
    img.className = "team-logo";
    img.style.width = thumbSize.value + "px";
    img.style.height = thumbSize.value + "px";

    const name = document.createElement("p");
    name.textContent = team.name;

    card.appendChild(img);
    card.appendChild(name);
    gallery.appendChild(card);
  });
}

// ------------------------------------------------------------
// Búsqueda por nombre
// ------------------------------------------------------------
searchInput?.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  const filtered = allTeams.filter(team =>
    team.name.toLowerCase().includes(q)
  );

  renderTeams(filtered);
});

// ------------------------------------------------------------
// Ordenar alfabéticamente
// ------------------------------------------------------------
sortSelect?.addEventListener("change", () => {
  let sorted = [...allTeams];

  if (sortSelect.value === "alpha") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortSelect.value === "alphaDesc") {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderTeams(sorted);
});

// ------------------------------------------------------------
// Ajustar tamaño de miniaturas
// ------------------------------------------------------------
thumbSize?.addEventListener("input", () => {
  const cards = document.querySelectorAll(".team-logo");
  cards.forEach(img => {
    img.style.width = thumbSize.value + "px";
    img.style.height = thumbSize.value + "px";
  });
});

// ------------------------------------------------------------
// Inicialización automática al cargar la página
// ------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  console.log("[MAIN] Página cargada. Iniciando loadTeams()");
  loadTeams();
});
