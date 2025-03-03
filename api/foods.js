const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

module.exports = (req, res) => {
    const query = req.query.query.toLowerCase();
    const results = [];

    fs.createReadStream(path.join(__dirname, '../public/static/Foods.csv'))
        .pipe(csv())
        .on('data', (row) => {
            if (row.product_name.toLowerCase().includes(query)) {
                results.push({
                    product_name: row.product_name,
                    carbohydrates_100g: row.carbohydrates_100g,
                    serving_size: row.serving_size,
                    serving_quantity: row.serving_quantity,
                    countries: row.countries,
                    image_nutrition_url: row.image_nutrition_url
                });
            }
        })
        .on('end', () => {
            res.json({ foods: results });
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
            res.status(500).json({ error: 'Failed to read CSV file' });
        });
};
