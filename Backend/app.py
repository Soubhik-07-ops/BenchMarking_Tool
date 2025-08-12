# File: backend/app.py

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

# This line allows the app to find your benchmark script
sys.path.append(os.path.join(os.getcwd(), 'python-scripts'))
import benchmark_and_process

app = Flask(__name__)

# Configure CORS to allow requests from your local and deployed frontend
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:3000",
    "https://bench-marking-tool.vercel.app"  # <-- Your Vercel URL is now allowed
]}})

@app.route('/')
def index():
    return "AI Benchmark Backend is running."

@app.route('/api/benchmark', methods=['POST'])
def handle_benchmark():
    """
    This endpoint handles the entire benchmark process.
    """
    try:
        # --- 1. Get File Paths from Frontend ---
        data = request.get_json()
        model1_path = data.get('model1Path')
        dataset1_path = data.get('dataset1Path')
        model2_path = data.get('model2Path')
        dataset2_path = data.get('dataset2Path')
        
        supabase_paths = [model1_path, dataset1_path, model2_path, dataset2_path]
        
        # --- 2. Run the Benchmark ---
        benchmark_results = benchmark_and_process.run_the_benchmark(supabase_paths)
            
        # --- 3. Automatic Cleanup ---
        print("Cleaning up files from Supabase Storage:", supabase_paths)
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            print("Warning: Supabase credentials for cleanup not set.", file=sys.stderr)
        else:
            supabase: Client = create_client(supabase_url, supabase_key)
            supabase.storage.from_("benchmarks").remove(supabase_paths)
        
        # --- 4. Return Success Response ---
        return jsonify({
            "message": "Comparison complete!",
            "data": benchmark_results
        })

    except Exception as e:
        print(f"❌ Benchmark API Error: {e}", file=sys.stderr)
        return jsonify({"error": "An internal server error occurred.", "details": str(e)}), 500