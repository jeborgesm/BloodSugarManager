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
