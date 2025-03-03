const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

/*app.use(express.static('public'));*/
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')))npm start

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

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
