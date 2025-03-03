const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 3001;

app.use(express.static('public'));

app.get('/api/foods/search', (req, res) => {
    const query = req.query.query.toLowerCase();
    const results = [];

    fs.createReadStream('public/static/Foods.csv')
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
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
