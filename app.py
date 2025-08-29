from flask import Flask, render_template, jsonify
import os, json

app = Flask(__name__, static_folder="static", template_folder="templates")

# Load resume data once on startup
DATA_PATH = os.path.join(app.root_path, "data.json")
with open(DATA_PATH, "r", encoding="utf-8") as f:
    resume_data = json.load(f)

@app.route("/")
def home():
    # Serve the page (HTML uses JS to fetch data from /api/data)
    return render_template("index.html")

@app.route("/api/data")
def api_data():
    # Return JSON for the page to populate dynamically
    return jsonify(resume_data)

if __name__ == "__main__":
    # Use debug while developing
    app.run(debug=True)
