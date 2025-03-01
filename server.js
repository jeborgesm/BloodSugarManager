const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/api/foods/search', (req, res) => {
    const query = req.query.query.toLowerCase();
    const results = [];

    fs.createReadStream('path/to/foods.csv')
        .pipe(csv())
        .on('data', (row) => {
            if (row.name.toLowerCase().includes(query)) {
                results.push(row);
            }
        })
        .on('end', () => {
            res.json({ foods: results });
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
