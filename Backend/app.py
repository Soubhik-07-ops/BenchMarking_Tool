import os
import zipfile
import subprocess
import shutil
import json
import traceback
from fpdf import FPDF
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
RESULTS_FOLDER = "results"
ALLOWED_EXTENSIONS = {"keras", "h5", "onnx"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["RESULTS_FOLDER"] = RESULTS_FOLDER

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "AI Model Benchmark API is running."}), 200

@app.route("/", methods=["POST"])
def upload_files():
    try:
        # Extract both models and both datasets
        model_files = request.files.getlist("models")
        dataset_files = request.files.getlist("datasets")

        if len(model_files) != 2 or len(dataset_files) != 2:
            return jsonify({"error": "Exactly 2 models and 2 datasets must be uploaded."}), 400

        # Clean previous uploads
        shutil.rmtree(UPLOAD_FOLDER, ignore_errors=True)
        shutil.rmtree(RESULTS_FOLDER, ignore_errors=True)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(RESULTS_FOLDER, exist_ok=True)

        model_paths = []
        dataset_dirs = []

        # Save models
        for i, model_file in enumerate(model_files):
            if not allowed_file(model_file.filename):
                return jsonify({"error": f"Model {i+1} has an invalid extension."}), 400

            ext = model_file.filename.rsplit(".", 1)[1].lower()
            filename = secure_filename(f"model{i+1}.{ext}")
            path = os.path.join(UPLOAD_FOLDER, filename)
            model_file.save(path)
            model_paths.append(path)

        # Save and extract datasets
        for i, dataset_file in enumerate(dataset_files):
            if not dataset_file.filename.endswith(".zip"):
                return jsonify({"error": f"Dataset {i+1} must be a ZIP file."}), 400

            filename = secure_filename(f"dataset{i+1}.zip")
            zip_path = os.path.join(UPLOAD_FOLDER, filename)
            dataset_file.save(zip_path)

            extract_dir = os.path.join(UPLOAD_FOLDER, f"dataset{i+1}")
            os.makedirs(extract_dir, exist_ok=True)

            with zipfile.ZipFile(zip_path, "r") as zip_ref:
                zip_ref.extractall(extract_dir)
            os.remove(zip_path)

            dataset_dirs.append(extract_dir)

        # Save config
        config = {"models": model_paths, "datasets": dataset_dirs}
        with open(os.path.join(UPLOAD_FOLDER, "config.json"), "w") as f:
            json.dump(config, f)

        # Run notebooks
        subprocess.run([
            "jupyter", "nbconvert", "--to", "notebook", "--execute", "process_notebook.ipynb",
            "--output", os.path.join(RESULTS_FOLDER, "process_output.ipynb")
        ], check=True)

        subprocess.run([
            "jupyter", "nbconvert", "--to", "notebook", "--execute", "metrics_notebook.ipynb",
            "--output", os.path.join(RESULTS_FOLDER, "metrics_output.ipynb")
        ], check=True)

        generate_pdf_report()

        return jsonify({
            "message": "Upload and comparison complete!",
            "redirect": "/get_results"
        }), 200

    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Notebook execution failed: {str(e)}"}), 500

    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "details": str(e),
            "trace": traceback.format_exc()
        }), 500

@app.route("/get_results", methods=["GET"])
def get_results():
    try:
        metrics_file = os.path.join(RESULTS_FOLDER, "metrics_output.json")
        chart_file = os.path.join(UPLOAD_FOLDER, "performance_metrics.png")

        if not os.path.exists(metrics_file):
            return jsonify({"error": "Results not found."}), 404

        with open(metrics_file, "r") as f:
            data = json.load(f)

        if os.path.exists(chart_file):
            data["chart_url"] = request.host_url.rstrip("/") + "/download_benchmark"

        return jsonify(data)

    except Exception as e:
        return jsonify({
            "error": "Failed to load results",
            "details": str(e),
            "trace": traceback.format_exc()
        }), 500

@app.route("/download_benchmark", methods=["GET"])
def download_benchmark():
    path = os.path.join(UPLOAD_FOLDER, "performance_metrics.png")
    if not os.path.exists(path):
        return jsonify({"error": "Chart not found."}), 404
    return send_file(path, as_attachment=True)

@app.route("/download_report", methods=["GET"])
def download_report():
    path = os.path.join(RESULTS_FOLDER, "metrics_output.pdf")
    if not os.path.exists(path):
        return jsonify({"error": "PDF not found."}), 404
    return send_file(path, as_attachment=True)

def generate_pdf_report():
    metrics_file = os.path.join(RESULTS_FOLDER, "metrics_output.json")
    chart_file = os.path.join(UPLOAD_FOLDER, "performance_metrics.png")
    pdf_path = os.path.join(RESULTS_FOLDER, "metrics_output.pdf")

    if not os.path.exists(metrics_file):
        return

    with open(metrics_file, "r") as f:
        data = json.load(f)

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, "Model Benchmark Report", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("Arial", size=12)
    for name, metrics in data.items():
        if name == "chart_url":
            continue
        pdf.set_font("Arial", "B", 12)
        pdf.cell(200, 10, f"{name}", ln=True)
        pdf.set_font("Arial", size=12)
        for key, value in metrics.items():
            pdf.cell(200, 10, f"  {key.replace('_', ' ').title()}: {value}", ln=True)
        pdf.ln(5)

    if os.path.exists(chart_file):
        pdf.image(chart_file, x=10, w=180)

    pdf.output(pdf_path)

if __name__ == "__main__":
    app.run(debug=True)
