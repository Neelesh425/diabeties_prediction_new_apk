// ----------------- DOM Ready Helper -----------------
function whenDOMReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

// ----------------- Load 3D Model Placeholders -----------------
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

// ----------------- Extra UI Init -----------------
function initExtras() {
  console.log("Extras initialized");
  // TODO: set up charts, sliders, etc.
}

// ----------------- Load Model Metadata -----------------
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

// ----------------- Handle Prediction Form -----------------
function initPredictForm() {
  const form = document.getElementById("predictForm");
  if (!form) return;

  const probText = document.getElementById("probText");
  const categoryText = document.getElementById("categoryText");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop reload

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        probText.textContent = (result.probability * 100).toFixed(1) + "%";
        categoryText.textContent = result.prediction === 1 ? "High Risk" : "Low Risk";
      } else {
        probText.textContent = "Error";
        categoryText.textContent = result.error || "Unknown issue";
      }
    } catch (err) {
      probText.textContent = "Error";
      categoryText.textContent = err.message;
    }
  });

  // Reset button logic
  const resetBtn = document.getElementById("clearBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      form.reset();
      probText.textContent = "—";
      categoryText.textContent = "";
    });
  }
}

// ----------------- Initialize Everything -----------------
whenDOMReady(() => {
  loadPlaceholders();   // Load 3D models
  initExtras();         // Initialize extras
  loadAllData();        // Fetch stats & metadata
  initPredictForm();    // Bind prediction form
});
