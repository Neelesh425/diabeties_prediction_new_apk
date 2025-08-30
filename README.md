
SweetForecast - BlueCyan Diabetes Predictor (landscape UI)
========================================================

This package includes a ready-to-run Flask app that serves a futuristic diabetes prediction UI.
hoc

  - glucose.glb
  - insulin.glb
  - heartbeat.glb

Quick start (Windows, Python 3.11, virtualenv):
1. unzip the package into a folder, e.g. sweetforecast/
2. python -m venv venv
3. venv\Scripts\activate
4. pip install -r requirements.txt
5. python app.py
6. open http://127.0.0.1:5000 in Chrome

Files included:
- app.py (Flask app)
- model/diabetes_pipeline.pkl (prebuilt pipeline)
- templates/index.html
- static/css/styles.css
- static/js/main.js
- requirements.txt