// 🔗 URL actualizada de tu Web App (API de datos)
const DATA_API_URL = "https://script.google.com/macros/s/AKfycbxYDKWAG5TEV9_U_FgNBWpvD8VMpoFqGsDC1fdlNtataVZZwg1ymYaJjdkRx0JcmAoC/exec";

document.addEventListener("DOMContentLoaded", () => {
  cargarDatos("candidatos", "candidatos");
  cargarDatos("proyectos", "proyectos");
});

async function cargarDatos(sheetKey, elementoId) {
  const contenedor = document.getElementById(elementoId);
  contenedor.innerHTML = "Cargando...";

  try {
    const res = await fetch(`${DATA_API_URL}?sheet=${sheetKey}`);
    const data = await res.json();

    if (data.error) {
      contenedor.innerHTML = `<p class="error">⚠️ Error: ${data.error}</p>`;
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      contenedor.innerHTML = "<p>No hay datos disponibles.</p>";
      return;
    }

    let html = "";
    const limite = Math.min(5, data.length);

    for (let i = 0; i < limite; i++) {
      const item = data[i];

      if (sheetKey === "candidatos") {
        const nombre = item["Nombre y Apellidos"] || item.Nombre || "—";
        const email = item["Correo electrónico"] || item.Email || "";
        const estado = item.Estado || "Pendiente";
        html += `<div class="card"><strong>${nombre}</strong> — ${estado}<br><small>${email}</small></div>`;
      } 
      else if (sheetKey === "proyectos") {
        const nombre = item.Nombre || item.Concepto || item.Título || "Proyecto sin nombre";
        html += `<div class="card">${nombre}</div>`;
      }
    }

    contenedor.innerHTML = html || "<p>Sin datos para mostrar.</p>";
  } catch (e) {
    contenedor.innerHTML = `<p class="error">⚠️ Error de conexión.</p>`;
    console.error("Error al cargar datos:", e);
  }
}
