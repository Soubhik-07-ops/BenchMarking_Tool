# File: backend/python-scripts/benchmark_and_process.py

import os
import sys
import json
import time
import shutil
import psutil
import zipfile
from contextlib import redirect_stdout
import io
import numpy as np
import matplotlib.pyplot as plt
from fpdf import FPDF

# Import Keras directly from TensorFlow
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.layers import Dense, Input
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# --- Helper Functions (TensorFlow Version) ---

def auto_configure_and_evaluate(model_path, dataset_path):
    model = load_model(model_path)
    with redirect_stdout(io.StringIO()):
        temp_gen = ImageDataGenerator(rescale=1./255).flow_from_directory(
            dataset_path, shuffle=False, batch_size=1
        )
    num_classes = temp_gen.num_classes
    input_shape = model.input_shape[1:]
    is_regression = model.output_shape[-1] == 1 and 'sigmoid' not in [
        layer.activation.__name__ for layer in model.layers if hasattr(layer, 'activation')
    ]
    config = {
        'target_size': input_shape[:2],
        'color_mode': 'rgb' if input_shape[-1] == 3 else 'grayscale',
        'class_mode': 'binary' if num_classes == 2 and not is_regression else 'categorical',
    }
    with redirect_stdout(io.StringIO()):
        test_gen = ImageDataGenerator(rescale=1./255).flow_from_directory(
            dataset_path,
            target_size=config['target_size'],
            color_mode=config['color_mode'],
            batch_size=32,
            class_mode=config['class_mode'],
            shuffle=False
        )
    eval_results = model.evaluate(test_gen, verbose=0)
    primary_metric = eval_results[0] if is_regression else eval_results[1] * 100
    return primary_metric, is_regression, model, test_gen

def measure_latency(model, generator, n_runs=50):
    times = []
    generator.reset()
    for _ in range(min(n_runs, len(generator.filenames))):
        img, _ = next(generator)
        start = time.perf_counter()
        model.predict(img, verbose=0)
        times.append((time.perf_counter() - start) * 1000)
    return np.mean(times) if times else 0

def measure_throughput(model, generator):
    num_samples = len(generator.filenames)
    generator.reset()
    start = time.perf_counter()
    model.predict(generator, steps=len(generator), verbose=0)
    duration = time.perf_counter() - start
    return num_samples / duration if duration > 0 else 0

def visualize_comparison(metrics1, metrics2, out_path):
    labels = ["Model 1", "Model 2"]
    keys = sorted([k for k, v in metrics1.items() if isinstance(v, (int, float))])
    vals1 = [float(metrics1.get(k, 0)) for k in keys]
    vals2 = [float(metrics2.get(k, 0)) for k in keys]
    x = np.arange(len(keys))
    width = 0.35
    fig, ax = plt.subplots(figsize=(14, 7))
    ax.bar(x - width / 2, vals1, width, label=labels[0], color='#8b5cf6')
    ax.bar(x + width / 2, vals2, width, label=labels[1], color='#ec4899')
    ax.set_ylabel('Metric Values', fontsize=12)
    ax.set_title('Model Performance Comparison', fontsize=16, weight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels([k.replace("_", " ").title() for k in keys], rotation=45, ha="right")
    ax.legend()
    ax.grid(axis='y', linestyle='--', alpha=0.7)
    fig.tight_layout()
    plt.savefig(out_path)
    plt.close()

def generate_pdf_report(data, chart_path, pdf_path):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Model Benchmark Report", ln=True, align="C")
    pdf.ln(10)
    for model_name, metrics in data.items():
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, model_name, ln=True)
        pdf.set_font("Arial", size=12)
        for key, value in metrics.items():
            display_key = key.replace('_', ' ').title()
            display_value = str(value) if value is not None else "N/A"
            pdf.cell(0, 8, f"    {display_key}: {display_value}", ln=True)
        pdf.ln(5)
    if os.path.exists(chart_path):
        pdf.add_page(orientation='L')
        pdf.image(chart_path, x=10, y=20, w=pdf.w - 20)
    pdf.output(pdf_path)

def run_full_benchmark(model_path, dataset_path):
    print(f"📦 Starting full benchmark for: {model_path}", file=sys.stderr)
    primary_metric, is_regression, model, generator = auto_configure_and_evaluate(model_path, dataset_path)
    metrics = {
        "latency_ms": round(measure_latency(model, generator), 2),
        "throughput_ips": round(measure_throughput(model, generator), 2),
        "model_size_mb": round(os.path.getsize(model_path) / (1024 * 1024), 2),
        "memory_usage_mb": round(psutil.Process(os.getpid()).memory_info().rss / (1024 * 1024), 2)
    }
    if is_regression:
        metrics["mse"] = round(primary_metric, 4)
        metrics["accuracy"] = None
    else:
        metrics["accuracy"] = round(primary_metric, 2)
        metrics["mse"] = None
    print(f"✅ Finished benchmark for: {model_path}", file=sys.stderr)
    return metrics

def run_the_benchmark(supabase_paths):
    # Use a temporary directory that works on any OS
    TEMP_DIR = os.path.join(os.getcwd(), "temp_processing")
    if not os.path.exists(TEMP_DIR):
        os.makedirs(TEMP_DIR)
        
    try:
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        if not supabase_url or not supabase_key:
            raise ValueError("Supabase URL or Service Role Key is not set as environment variables.")
        from supabase import create_client, Client
        supabase: Client = create_client(supabase_url, supabase_key)
        
        local_paths = []
        print(f"📦 Downloading files from Supabase...", file=sys.stderr)

        for spath in supabase_paths:
            file_name = spath.split('/')[-1]
            local_file_path = os.path.join(TEMP_DIR, file_name)
            with open(local_file_path, "wb+") as f:
                res = supabase.storage.from_("benchmarks").download(path=spath)
                f.write(res)
            local_paths.append(local_file_path)
        print(f"✅ Files downloaded successfully.", file=sys.stderr)

        local_model1_path, local_dataset1_zip, local_model2_path, local_dataset2_zip = local_paths
        
        dataset1_dir = os.path.join(TEMP_DIR, "dataset1_extracted")
        dataset2_dir = os.path.join(TEMP_DIR, "dataset2_extracted")
        if os.path.exists(dataset1_dir): shutil.rmtree(dataset1_dir)
        if os.path.exists(dataset2_dir): shutil.rmtree(dataset2_dir)
        
        with zipfile.ZipFile(local_dataset1_zip, "r") as zf: zf.extractall(dataset1_dir)
        with zipfile.ZipFile(local_dataset2_zip, "r") as zf: zf.extractall(dataset2_dir)
        
        metrics1 = run_full_benchmark(local_model1_path, dataset1_dir)
        metrics2 = run_full_benchmark(local_model2_path, dataset2_dir)

        combined_results = {"Model 1": metrics1, "Model 2": metrics2}
        
        # Note: PDF generation is disabled in this version as Render's temp filesystem is complex.
        # The raw JSON data is returned instead.

        return combined_results

    finally:
        # Clean up the temporary directory
        if os.path.exists(TEMP_DIR):
            shutil.rmtree(TEMP_DIR)