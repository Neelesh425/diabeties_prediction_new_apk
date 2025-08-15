function whenDOMReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

async function loadPlaceholders() {
  const phs = document.querySelectorAll(".model-placeholder");

  for (const ph of phs) {
    const fname = ph.getAttribute("data-model");
    if (!fname) {
      ph.innerHTML = `<div class="missing">No model specified</div>`;
      continue;
    }

    const url = `/static/models/${fname}`;

    try {
      // Quick check if file exists
      const response = await fetch(url, { method: "HEAD" });
      if (!response.ok) throw new Error(`Model not found: ${fname}`);

      const mv = document.createElement("model-viewer");
      mv.setAttribute("src", url);
      mv.setAttribute("alt", fname);
      mv.setAttribute("auto-rotate", "");
      mv.setAttribute("camera-controls", "");
      mv.setAttribute("shadow-intensity", "1");
      mv.style.width = "100%";
      mv.style.height = ph.style.height || "320px";

      ph.innerHTML = "";
      ph.appendChild(mv);

    } catch (err) {
      console.error(err);
      ph.innerHTML = `<div class="missing">3D model "${fname}" not found in static/models/</div>`;
    }
  }
}

function initExtras() {
  console.log("Extras initialized");
  // TODO: set up charts, sliders, etc.
}

async function loadAllData() {
  try {
    const [stats, fi, metadata] = await Promise.all([
      fetch("/model/stats").then(r => r.json()),
      fetch("/model/feature_importances").then(r => r.json()),
      fetch("/model/metadata").then(r => r.json())
    ]);
    console.log("Stats:", stats);
    console.log("Feature Importances:", fi);
    console.log("Metadata:", metadata);
    // TODO: populate UI with this data
  } catch (err) {
    console.error("Error loading initial data:", err);
  }
}

whenDOMReady(() => {
  loadPlaceholders();   // Load 3D models
  initExtras();         // Initialize extras
  loadAllData();        // Fetch stats & metadata
});
