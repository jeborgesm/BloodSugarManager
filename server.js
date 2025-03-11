const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/foods', (req, res) => {
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

app.post('/api/foods', (req, res) => {
    const newFood = req.body;
    const csvLine = `${newFood.product_name},${newFood.carbohydrates_100g},${newFood.serving_size},${newFood.serving_quantity},${newFood.countries},${newFood.image_nutrition_url}\n`;

    fs.appendFile('public/static/Foods.csv', csvLine, (err) => {
        if (err) {
            console.error('Error writing to CSV file:', err);
            return res.status(500).json({ error: 'Failed to add food to CSV file' });
        }
        res.status(201).json({ message: 'Food added successfully' });
    });
});

app.delete('/api/foods/:productName', (req, res) => {
    const productName = req.params.productName.toLowerCase();
    const tempFilePath = 'public/static/Foods_temp.csv';
    const results = [];

    fs.createReadStream('public/static/Foods.csv')
        .pipe(csv())
        .on('data', (row) => {
            if (row.product_name.toLowerCase() !== productName) {
                results.push(row);
            }
        })
        .on('end', () => {
            const csvWriter = fs.createWriteStream(tempFilePath);
            csvWriter.write('product_name,carbohydrates_100g,serving_size,serving_quantity,countries,image_nutrition_url\n');
            results.forEach(row => {
                csvWriter.write(`${row.product_name},${row.carbohydrates_100g},${row.serving_size},${row.serving_quantity},${row.countries},${row.image_nutrition_url}\n`);
            });
            csvWriter.end();

            csvWriter.on('finish', () => {
                fs.rename(tempFilePath, 'public/static/Foods.csv', (err) => {
                    if (err) {
                        console.error('Error renaming temp CSV file:', err);
                        return res.status(500).json({ error: 'Failed to delete food from CSV file' });
                    }
                    res.status(200).json({ message: 'Food deleted successfully' });
                });
            });
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
            res.status(500).json({ error: 'Failed to read CSV file' });
        });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
