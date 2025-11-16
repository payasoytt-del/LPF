// simulator.js
// Módulo inicial del sistema de simulación de estructura del fútbol argentino
// --------------------------------------------------------------
// Este archivo prepara el motor base que:
// 1) Recibe años objetivo
// 2) Recibe formato deseado (cantidades de equipos por categoría)
// 3) Genera un plan año por año para acercarse al formato meta
// 4) El index.html muestra luego los resultados en #simulationOutput
// --------------------------------------------------------------

console.log("[SIMULATOR] Cargado simulator.js");

// Categorías actuales del fútbol argentino (referencia base)
// Notar que la 3ra categoría tiene dos torneos paralelos.
const BASE_STRUCTURE = {
  primera: 28,          // Liga Profesional
  nacional: 38,         // Primera Nacional
  federalA: 36,         // Federal A
  bmetro: 22,           // Primera B Metropolitana
  primeraC: 20,         // Primera C
  promocional: 18       // Torneo Promocional Amateur
};

// Función principal de simulación
function simulateLeagueEvolution(years, targetFormat, matchdays) {
  const plan = [];

  // Estructura inicial (copiamos valores)
  let state = { ...BASE_STRUCTURE };

  for (let year = 1; year <= years; year++) {
    const yearData = { year, before: { ...state }, changes: {}, after: {} };

    // Ajustes por categoría para acercarse al formato objetivo
    for (const cat in targetFormat) {
      const current = state[cat] ?? 0;
      const goal = targetFormat[cat];
      let diff = goal - current;

      // estrategia simple: solo mover de a 1 equipo por año hacia el objetivo
      if (diff > 0) {
        state[cat] = current + 1; // expansión
        yearData.changes[cat] = "+1 (expansión)";
      } else if (diff < 0) {
        state[cat] = current - 1; // reducción
        yearData.changes[cat] = "-1 (reducción)";
      } else {
        yearData.changes[cat] = "0 (sin cambio)";
      }
    }

    yearData.after = { ...state };
    yearData.matchdays = matchdays;

    plan.push(yearData);
  }

  return plan;
}

// Conexión con index.html
const btnSimulate = document.getElementById("btn-simulate");
const output = document.getElementById("simulationOutput");
const simSummary = document.getElementById("simSummary");

btnSimulate.addEventListener("click", () => {
  const years = parseInt(document.getElementById("input-years").value);
  const matchdays = parseInt(document.getElementById("input-days").value);

  let targetFormat;
  try {
    targetFormat = JSON.parse(document.getElementById("input-target-format").value);
  } catch {
    alert("Error: El formato objetivo debe ser un JSON válido.");
    return;
  }

  const result = simulateLeagueEvolution(years, targetFormat, matchdays);

  // Mostrar resultados
  simSummary.innerHTML = "";
  output.style.display = "block";

  result.forEach(entry => {
    const div = document.createElement("div");
    div.className = "sim-year";

    div.innerHTML = `
      <h3>Año ${entry.year}</h3>
      <pre><b>Antes:</b> ${JSON.stringify(entry.before, null, 2)}</pre>
      <pre><b>Cambios:</b> ${JSON.stringify(entry.changes, null, 2)}</pre>
      <pre><b>Después:</b> ${JSON.stringify(entry.after, null, 2)}</pre>
      <p><b>Fechas:</b> ${entry.matchdays}</p>
    `;

    simSummary.appendChild(div);
  });
});
