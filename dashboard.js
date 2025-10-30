document.addEventListener("DOMContentLoaded", () => {
  if (typeof DATA_API_URL === 'undefined') {
    console.error("❌ Olvidaste definir DATA_API_URL en index.html");
    return;
  }

  cargarDatos("candidatos", "candidatos");
  cargarDatos("proyectos", "proyectos");
});

async function cargarDatos(sheetKey, elementoId) {
  const contenedor = document.getElementById(elementoId);
  try {
    const res = await fetch(`${DATA_API_URL}?sheet=${sheetKey}`);
    const data = await res.json();

    if (data.error) {
      contenedor.innerHTML = `<p class="error">⚠️ ${data.error}</p>`;
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      contenedor.innerHTML = "<p>No hay datos disponibles.</p>";
      return;
    }

    const limite = 5;
    const items = data.slice(0, limite).map(item => {
      if (sheetKey === "candidatos") {
        return `<div class="card">${item.Nombre || item.nombre || '—'} — ${item.Estado || 'Pendiente'}</div>`;
      } else if (sheetKey === "proyectos") {
        return `<div class="card">${item.Nombre || item.Título || item.Concepto || 'Proyecto'}</div>`;
      }
      return `<div class="card">${JSON.stringify(item)}</div>`;
    }).join("");

    contenedor.innerHTML = items;
  } catch (e) {
    contenedor.innerHTML = `<p class="error">⚠️ Error al cargar ${sheetKey}</p>`;
    console.error(e);
  }
}