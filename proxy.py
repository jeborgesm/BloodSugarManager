from flask import Flask, request, jsonify
import csv
import os

app = Flask(__name__)

foods_file_path = os.path.join(app.static_folder, 'foods.csv')

@app.route('/api/foods/search')
def search_foods():
    query = request.args.get('query', '').lower()
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    results = []
    try:
        with open(foods_file_path, 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if query in row['product_name'].lower():
                    results.append({
                        'product_name': row['product_name'],
                        'carbohydrates_100g': float(row['carbohydrates_100g']),
                        'serving_size': row['serving_size']
                    })
    except Exception as e:
        return jsonify({'error': 'Failed to read foods.csv', 'message': str(e)}), 500

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)