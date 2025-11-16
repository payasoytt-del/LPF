// gallery.js
// Este script carga la lista de equipos desde data/teams.json
// y los muestra en la galería del index.html

// Contenedor donde se agregarán los equipos
const galleryContainer = document.getElementById("gallery");

// Cargar archivo JSON con los equipos
fetch("data/teams.json")
  .then(response => response.json())
  .then(teams => {
    teams.forEach(team => {
      const card = document.createElement("div");
      card.className = "team-card";

      const img = document.createElement("img");
      img.src = team.logo;
      img.alt = team.name;

      const name = document.createElement("p");
      name.textContent = team.name;

      card.appendChild(img);
      card.appendChild(name);
      galleryContainer.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error cargando teams.json:", error);
  });
