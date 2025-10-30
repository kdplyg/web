const DATA_API_URL = "https://script.google.com/macros/s/AKfycbxesyUkZre_XktqG5r9cMVTTbEdhUuz0YGa2tIK7f1sZf5iOkN_4JBFpz60dCGcCZBA/exec";

document.addEventListener("DOMContentLoaded", () => {
  cargarDatos("candidatos", "candidatos");
  cargarDatos("proyectos", "proyectos");
});

async function cargarDatos(sheetKey, elementoId) {
  const contenedor = document.getElementById(elementoId);
  contenedor.innerHTML = "Cargando...";

  try {
    const res = await fetch(`${DATA_API_URL}?sheet=${sheetKey}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      contenedor.innerHTML = `<p class="error">⚠️ Respuesta no válida. ¿Web App pública?</p>`;
      console.error("Respuesta:", text);
      return;
    }

    if (data.error) {
      contenedor.innerHTML = `<p class="error">⚠️ ${data.error}</p>`;
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      contenedor.innerHTML = "<p>No hay datos.</p>";
      return;
    }

    let html = "";
    const items = data.slice(0, 5);

    for (const item of items) {
      if (sheetKey === "candidatos") {
        // Usamos los encabezados EXACTOS que me diste
        const nombre = item["Nombre completo"] || "—";
        const email = item["Dirección de correo electrónico"] || "";
        const estado = item["Estado"] || "Pendiente";
        html += `<div class="card"><strong>${nombre}</strong> — ${estado}<br><small>${email}</small></div>`;
      } 
      else if (sheetKey === "proyectos") {
        // Encabezados exactos de proyectos
        const nombre = item["Nombre del Proyecto"] || item.ID || "Sin nombre";
        const estado = item["Estado proyecto"] || "";
        html += `<div class="card"><strong>${nombre}</strong>${estado ? ` — ${estado}` : ""}</div>`;
      }
    }

    contenedor.innerHTML = html || "<p>Sin datos para mostrar.</p>";
  } catch (e) {
    contenedor.innerHTML = `<p class="error">⚠️ Error: ${e.message}</p>`;
    console.error(e);
  }
}
