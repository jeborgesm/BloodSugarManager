from flask import Flask, send_from_directory, request, jsonify
import json
import os

app = Flask(__name__)

foods_file_path = os.path.join(app.static_folder, 'foods.json')

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/carbtable')
def serve_carb_table():
    return send_from_directory('public', 'carbtable.html')

@app.route('/carbtablefromjson')
def serve_carb_table_from_json():
    return send_from_directory('public', 'carbtablefromjson.html')

@app.route('/saveFoods', methods=['POST'])
def save_foods():
    data = request.get_json()
    try:
        with open(foods_file_path, 'w') as f:
            json.dump(data, f, indent=4)
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run()