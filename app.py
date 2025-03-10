from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import csv
import os
import logging

app = Flask(__name__, static_folder='build')
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Ensure the correct path to Foods.csv
foods_file_path = os.path.join(app.static_folder, 'static', 'Foods.csv')
app.logger.debug(f"Foods file path: {foods_file_path}")  # Log the file path

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/carbtable')
def serve_carb_table():
    return send_from_directory(app.static_folder, 'carbtable.html')

@app.route('/carbtablefromjson')
def serve_carb_table_from_json():
    return send_from_directory(app.static_folder, 'carbtablefromjson.html')

@app.route('/saveFoods', methods=['POST'])
def save_foods():
    data = request.get_json()
    try:
        with open(foods_file_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['product_name', 'carbohydrates_100g', 'serving_size', 'serving_quantity', 'countries', 'image_nutrition_url'])  # Write header
            for food in data:
                writer.writerow([food['product_name'], food['carbohydrates_100g'], food['serving_size'], food['serving_quantity'], food['countries'], food['image_nutrition_url']])
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        app.logger.error(f"Error saving foods: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/foods', methods=['GET'])
def search_foods():
    query = request.args.get('query', '').lower()
    app.logger.debug(f"aSearching for: {query}")  # Log the search query
    results = []
    try:
        app.logger.debug(f"Searching for: {query}")  # Log the search query
        with open(foods_file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            foods = list(reader)
            app.logger.debug(f"Foods data: {foods}")  # Log the contents of Foods.csv
            for row in foods:
                if query in row['product_name'].lower():
                    results.append(row)
            app.logger.debug(f"Search results: {results}")  # Log the search results
        return jsonify({'foods': results}), 200
    except Exception as e:
        app.logger.error(f"Error searching foods: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
