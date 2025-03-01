import React, { useState } from 'react';

function CarbTablePage() {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [totalCarbs, setTotalCarbs] = useState(0);

    function handleSearchInput(event) {
        const query = event.target.value.toLowerCase();
        if (query.length > 2) {
            fetch(`/api/foods/search?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data.foods)) {
                        setSearchResults(data.foods);
                    } else {
                        console.error('Unexpected response format:', data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else {
            setSearchResults([]);
        }
    }

    function handleAddFood(food) {
        setSelectedFoods([...selectedFoods, food]);
        setTotalCarbs(totalCarbs + parseFloat(food.carbohydrates_100g));
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Carb Table</h1>
            <div className="form-group">
                <input type="text" id="search-input" className="form-control" placeholder="Search for food" onInput={handleSearchInput} />
            </div>
            <table id="searchResultsTable" className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Food</th>
                        <th>Carbohydrates (g per 100g)</th>
                        <th>Serving Size</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.map((food, index) => (
                        <tr key={index}>
                            <td>{food.product_name}</td>
                            <td>{food.carbohydrates_100g}</td>
                            <td>{food.serving_size || 'N/A'}</td>
                            <td><button className="btn btn-primary btn-sm" onClick={() => handleAddFood(food)}>Add</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2 className="mt-5">Selected Foods</h2>
            <table id="selectedFoodsTable" className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Food</th>
                        <th>Carbohydrates (g per 100g)</th>
                        <th>Serving Size</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedFoods.map((food, index) => (
                        <tr key={index}>
                            <td>{food.product_name}</td>
                            <td>{food.carbohydrates_100g}</td>
                            <td>{food.serving_size || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="font-weight-bold">Total Carbohydrates: <span id="totalCarbs">{totalCarbs}</span> grams</div>
        </div>
    );
}

export default CarbTablePage;
