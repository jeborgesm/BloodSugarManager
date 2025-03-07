import React, { useState, useEffect, useCallback } from 'react';

function CarbTablePage() {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationRange, setPaginationRange] = useState([1, 10]); // Initial range for pagination items
    const itemsPerPage = 10;

    const handleAddFood = useCallback((food) => {
        const newFood = {
            name: food.product_name,
            carbs: food.carbohydrates_100g,
            serving: food.serving_size || 'N/A'
        };
        const newTotalCarbs = totalCarbs + parseFloat(food.carbohydrates_100g);
        setSelectedFoods([...selectedFoods, newFood]);
        setTotalCarbs(newTotalCarbs);
    }, [selectedFoods, totalCarbs]);

    const renderSearchResults = useCallback((results) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedResults = results.slice(startIndex, endIndex);

        return paginatedResults.map((food, index) => (
            <tr key={index}>
                <td>{food.product_name}</td>
                <td>{food.carbohydrates_100g}</td>
                <td>{food.serving_size || 'N/A'}</td>
                <td><button className="btn btn-primary btn-sm" onClick={() => handleAddFood(food)}>Add</button></td>
            </tr>
        ));
    }, [currentPage, itemsPerPage, handleAddFood]);

    useEffect(() => {
        renderSearchResults(searchResults);
    }, [searchResults, currentPage, renderSearchResults]);

    const handleSearchInput = useCallback((event) => {
        const query = event.target.value.toLowerCase();
        if (query.length > 2) {
            console.log(`Searching for: ${query}`); // Log the search query
            fetch(`/api/foods?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    console.log('API Response:', data); // Log the API response
                    if (Array.isArray(data.foods)) {
                        setSearchResults(data.foods);
                        setCurrentPage(1); // Reset to first page on new search
                        setPaginationRange([1, 10]); // Reset pagination range
                        console.log('Search Results:', data.foods); // Log the search results
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
    }, []);

    const handlePageClick = useCallback((e, pageNumber) => {
        e.preventDefault();
        setCurrentPage(pageNumber);
    }, []);

    const handleNextClick = useCallback((e) => {
        e.preventDefault();
        setPaginationRange([paginationRange[0] + 10, paginationRange[1] + 10]);
    }, [paginationRange]);

    const handlePrevClick = useCallback((e) => {
        e.preventDefault();
        setPaginationRange([paginationRange[0] - 10, paginationRange[1] - 10]);
    }, [paginationRange]);

    const renderPagination = useCallback((totalItems) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginationItems = [];

        if (paginationRange[0] > 1) {
            paginationItems.push(
                <li key="prev" className="page-item">
                    <button className="page-link" onClick={handlePrevClick}>Previous</button>
                </li>
            );
        }

        for (let i = paginationRange[0]; i <= paginationRange[1] && i <= totalPages; i++) {
            paginationItems.push(
                <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={(e) => handlePageClick(e, i)}>{i}</button>
                </li>
            );
        }

        if (paginationRange[1] < totalPages) {
            paginationItems.push(
                <li key="next" className="page-item">
                    <button className="page-link" onClick={handleNextClick}>Next</button>
                </li>
            );
        }

        return paginationItems;
    }, [currentPage, itemsPerPage, handlePageClick, handleNextClick, handlePrevClick, paginationRange]);

    const renderSelectedFoods = useCallback(() => {
        return selectedFoods.map((food, index) => (
            <tr key={index}>
                <td>{food.name}</td>
                <td>{food.carbs}</td>
                <td>{food.serving}</td>
            </tr>
        ));
    }, [selectedFoods]);

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
                    {renderSearchResults(searchResults)}
                </tbody>
            </table>
            <nav>
                <ul className="pagination" id="pagination">
                    {renderPagination(searchResults.length)}
                </ul>
            </nav>

            import React, { useState, useEffect, useCallback, useMemo } from 'react';

            function CombinedPage() {
                const [searchResults, setSearchResults] = useState([]);
                const [selectedFoods, setSelectedFoods] = useState([]);
                const [totalCarbs, setTotalCarbs] = useState(0);
                const [currentPage, setCurrentPage] = useState(1);
                const [paginationRange, setPaginationRange] = useState([1, 10]); // Initial range for pagination items
                const itemsPerPage = 10;

                const [carbInputs, setCarbInputs] = useState([{ food: '', carbs: 0 }]);
                const [ratio, setRatio] = useState(20);
                const [currentBloodSugar, setCurrentBloodSugar] = useState(0);
                const [correctionInsulin, setCorrectionInsulin] = useState(0);
                const [highBloodSugarInsulin, setHighBloodSugarInsulin] = useState(0);

                const totalCarbsFromInputs = useMemo(() => {
                    return carbInputs.reduce((sum, input) => sum + parseFloat(input.carbs || 0), 0);
                }, [carbInputs]);

                const carbInsulin = useMemo(() => {
                    return (totalCarbsFromInputs / ratio).toFixed(2);
                }, [totalCarbsFromInputs, ratio]);

                const totalInsulin = useMemo(() => {
                    const total = parseFloat(carbInsulin) + parseFloat(highBloodSugarInsulin);
                    return (Math.round(total * 2) / 2).toFixed(1);
                }, [carbInsulin, highBloodSugarInsulin]);

                const updateCorrectionInsulin = useCallback((currentBloodSugar) => {
                    let units = 0;
                    if (currentBloodSugar >= 150 && currentBloodSugar <= 199) units = 1;
                    else if (currentBloodSugar >= 200 && currentBloodSugar <= 249) units = 2;
                    else if (currentBloodSugar >= 250 && currentBloodSugar <= 299) units = 3;
                    else if (currentBloodSugar >= 300 && currentBloodSugar <= 349) units = 4;
                    else if (currentBloodSugar >= 350 && currentBloodSugar <= 399) units = 5;
                    else if (currentBloodSugar >= 400 && currentBloodSugar <= 449) units = 6;
                    else if (currentBloodSugar >= 450 && currentBloodSugar <= 499) units = 7;
                    else if (currentBloodSugar >= 500 && currentBloodSugar <= 549) units = 8;
                    else if (currentBloodSugar >= 550 && currentBloodSugar <= 599) units = 9;
                    setCorrectionInsulin(units);
                    setHighBloodSugarInsulin(units);
                }, []);

                const addRow = useCallback(() => {
                    setCarbInputs([...carbInputs, { food: '', carbs: 0 }]);
                }, [carbInputs]);

                const handleCarbInputChange = useCallback((index, field, value) => {
                    const newCarbInputs = [...carbInputs];
                    newCarbInputs[index][field] = value;
                    setCarbInputs(newCarbInputs);
                }, [carbInputs]);

                const handleRatioChange = useCallback((e) => {
                    setRatio(e.target.value);
                }, []);

                const handleCurrentBloodSugarChange = useCallback((e) => {
                    const value = e.target.value;
                    setCurrentBloodSugar(value);
                    updateCorrectionInsulin(value);
                }, [updateCorrectionInsulin]);

                const handleAddFood = useCallback((food) => {
                    const newFood = {
                        name: food.product_name,
                        carbs: food.carbohydrates_100g,
                        serving: food.serving_size || 'N/A'
                    };
                    const newTotalCarbs = totalCarbs + parseFloat(food.carbohydrates_100g);
                    setSelectedFoods([...selectedFoods, newFood]);
                    setTotalCarbs(newTotalCarbs);
                }, [selectedFoods, totalCarbs]);

                const renderSearchResults = useCallback((results) => {
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const paginatedResults = results.slice(startIndex, endIndex);

                    return paginatedResults.map((food, index) => (
                        <tr key={index}>
                            <td>{food.product_name}</td>
                            <td>{food.carbohydrates_100g}</td>
                            <td>{food.serving_size || 'N/A'}</td>
                            <td><button className="btn btn-primary btn-sm" onClick={() => handleAddFood(food)}>Add</button></td>
                        </tr>
                    ));
                }, [currentPage, itemsPerPage, handleAddFood]);

                useEffect(() => {
                    renderSearchResults(searchResults);
                }, [searchResults, currentPage, renderSearchResults]);

                const handleSearchInput = useCallback((event) => {
                    const query = event.target.value.toLowerCase();
                    if (query.length > 2) {
                        fetch(`/api/foods?query=${query}`)
                            .then(response => response.json())
                            .then(data => {
                                if (Array.isArray(data.foods)) {
                                    setSearchResults(data.foods);
                                    setCurrentPage(1); // Reset to first page on new search
                                    setPaginationRange([1, 10]); // Reset pagination range
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
                }, []);

                const handlePageClick = useCallback((e, pageNumber) => {
                    e.preventDefault();
                    setCurrentPage(pageNumber);
                }, []);

                const handleNextClick = useCallback((e) => {
                    e.preventDefault();
                    setPaginationRange([paginationRange[0] + 10, paginationRange[1] + 10]);
                }, [paginationRange]);

                const handlePrevClick = useCallback((e) => {
                    e.preventDefault();
                    setPaginationRange([paginationRange[0] - 10, paginationRange[1] - 10]);
                }, [paginationRange]);

                const renderPagination = useCallback((totalItems) => {
                    const totalPages = Math.ceil(totalItems / itemsPerPage);
                    const paginationItems = [];

                    if (paginationRange[0] > 1) {
                        paginationItems.push(
                            <li key="prev" className="page-item">
                                <button className="page-link" onClick={handlePrevClick}>Previous</button>
                            </li>
                        );
                    }

                    for (let i = paginationRange[0]; i <= paginationRange[1] && i <= totalPages; i++) {
                        paginationItems.push(
                            <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                                <button className="page-link" onClick={(e) => handlePageClick(e, i)}>{i}</button>
                            </li>
                        );
                    }

                    if (paginationRange[1] < totalPages) {
                        paginationItems.push(
                            <li key="next" className="page-item">
                                <button className="page-link" onClick={handleNextClick}>Next</button>
                            </li>
                        );
                    }

                    return paginationItems;
                }, [currentPage, itemsPerPage, handlePageClick, handleNextClick, handlePrevClick, paginationRange]);

                const renderSelectedFoods = useCallback(() => {
                    return selectedFoods.map((food, index) => (
                        <tr key={index}>
                            <td>{food.name}</td>
                            <td>{food.carbs}</td>
                            <td>{food.serving}</td>
                        </tr>
                    ));
                }, [selectedFoods]);

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
                                {renderSearchResults(searchResults)}
                            </tbody>
                        </table>
                        <nav>
                            <ul className="pagination" id="pagination">
                                {renderPagination(searchResults.length)}
                            </ul>
                        </nav>

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
                                {renderSelectedFoods()}
                            </tbody>
                        </table>
                        <div className="font-weight-bold">Total Carbohydrates: <span id="total-carbs">{totalCarbs}</span> grams</div>

                        <h1 className="mb-4">Blood Sugar Manager</h1>
                        <table id="carbTable" className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Foods Eaten</th>
                                    <th>Grams of Carbohydrate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carbInputs.map((input, index) => (
                                    <tr key={index}>
                                        <td><input type="text" placeholder="Enter food" className="form-control" value={input.food} onChange={(e) => handleCarbInputChange(index, 'food', e.target.value)} /></td>
                                        <td><input type="number" className="form-control carb-input" placeholder="Enter grams" value={input.carbs} onChange={(e) => handleCarbInputChange(index, 'carbs', e.target.value)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>Total</td>
                                    <td id="totalCarbs">{totalCarbsFromInputs}</td>
                                </tr>
                            </tfoot>
                        </table>
                        <button onClick={addRow} className="btn btn-primary">Add Row</button>
                        <div>
                            <br />
                            <div className="card">
                                <div className="card-header">
                                    <h4>Insulin-to-carb ratio</h4>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">1 unit of rapid-acting insulin for every <input type="number" id="ratioInput" value={ratio} className="form-control d-inline-block w-auto" onChange={handleRatioChange} /> grams of carbohydrates</h5>
                                    <p>
                                        Total grams of carbohydrate: <input type="number" id="totalCarbInput" value={totalCarbsFromInputs} className="form-control d-inline-block w-auto" readOnly /> g /
                                        <input type="number" id="ratioInput2" value={ratio} className="form-control d-inline-block w-auto" onChange={handleRatioChange} /> =
                                        <h1><span id="insulinUnits">{carbInsulin}</span></h1> units rapid-acting insulin for meal.
                                    </p>
                                </div>
                            </div>
                            <br />
                            <div className="card">
                                <div className="card-header">
                                    <h4>High Blood Sugar Correction: Give 1 unit of Insulin for 50 mg/dL over 150</h4>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">
                                    <table id="insulinTable" className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Blood Sugar (mg/dL)</th>
                                                <th>Insulin (units)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>150 - 199</td><td>1</td></tr>
                                            <tr><td>200 - 249</td><td>2</td></tr>
                                            <tr><td>250 - 299</td><td>3</td></tr>
                                            <tr><td>300 - 349</td><td>4</td></tr>
                                            <tr><td>350 - 399</td><td>5</td></tr>
                                            <tr><td>400 - 449</td><td>6</td></tr>
                                            <tr><td>450 - 499</td><td>7</td></tr>
                                            <tr><td>500 - 549</td><td>8</td></tr>
                                            <tr><td>550 - 599</td><td>9</td></tr>
                                        </tbody>
                                    </table>
                                    <div>
                                        <h3>
                                            <label htmlFor="currentBloodSugar">Current Blood Sugar</label>
                                            <input type="number" id="currentBloodSugar" className="form-control d-inline-block w-auto" value={currentBloodSugar} onChange={handleCurrentBloodSugarChange} />
                                            <label htmlFor="correctionInsulin">Units of Insulin for correction</label>
                                            <input type="number" id="correctionInsulin" className="form-control d-inline-block w-auto" value={correctionInsulin} readOnly />
                                        </h3>
                                    </div>
                                </h5>
                            </div>
                            </div>
                            <br />
                            <div className="card">
                                <div className="card-header">
                                    <h4>Add the units of insulin for carbohydrate coverage to the units of insulin needed for high blood glucose to get your total meal insulin dose</h4>
                                </div>
                                <div className="card-body">
                                    <p><input type="number" id="carbInsulin" className="form-control d-inline-block w-auto" value={carbInsulin} readOnly /> units for carbohydrate coverage</p>
                                    <p><input type="number" id="highBloodSugarInsulin" className="form-control d-inline-block w-auto" value={highBloodSugarInsulin} readOnly /> + units for high blood sugar (based on the High Blood Sugar Correction table) </p>
                                </div>
                            </div>
                            <div className="card text-white bg-primary mb-3" style={{ maxWidth: '18rem' }}>
                                <div className="card-header"><h3>TOTAL UNITS of rapid-acting insulin</h3></div>
                                <div className="card-body">
                                    <h2 className="card-title"><span id="totalInsulin">{totalInsulin}</span></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            export default CombinedPage;
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
                    {renderSelectedFoods()}
                </tbody>
            </table>
            <div className="font-weight-bold">Total Carbohydrates: <span id="total-carbs">{totalCarbs}</span> grams</div>
        </div>
    );
}

export default CarbTablePage;
