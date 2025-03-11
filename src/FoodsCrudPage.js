import React, { useState, useEffect } from 'react';

function FoodsCrudPage() {
    const [foods, setFoods] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Updated to 10 items per page
    const [editFood, setEditFood] = useState({ product_name: '', carbohydrates_100g: '', serving_size: '' });
    const [paginationRange, setPaginationRange] = useState([1, 10]); // Initial range for pagination items

    const fetchFoods = async () => {
        const response = await fetch(`/api/foods?query=${searchQuery}`);
        const data = await response.json();
        setFoods(data.foods);
    };

    useEffect(() => {
        fetchFoods();
    }, [searchQuery, currentPage, fetchFoods]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
        setPaginationRange([1, 10]); // Reset pagination range on new search
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEditClick = (food) => {
        setEditFood(food);
    };

    const handleDeleteClick = async (productName) => {
        await fetch(`/api/foods/${productName}`, { method: 'DELETE' });
        fetchFoods();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFood({ ...editFood, [name]: value });
    };

    const handleSaveClick = async () => {
        await fetch(`/api/foods`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editFood),
        });
        fetchFoods();
        setEditFood({ product_name: '', carbohydrates_100g: '', serving_size: '' });
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(foods.length / itemsPerPage);
        const paginationItems = [];

        if (paginationRange[0] > 1) {
            paginationItems.push(
                <li key="prev" className="page-item">
                    <button className="page-link" onClick={() => setPaginationRange([paginationRange[0] - 10, paginationRange[1] - 10])}>Previous</button>
                </li>
            );
        }

        for (let i = paginationRange[0]; i <= paginationRange[1] && i <= totalPages; i++) {
            paginationItems.push(
                <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
                </li>
            );
        }

        if (paginationRange[1] < totalPages) {
            paginationItems.push(
                <li key="next" className="page-item">
                    <button className="page-link" onClick={() => setPaginationRange([paginationRange[0] + 10, paginationRange[1] + 10])}>Next</button>
                </li>
            );
        }

        return paginationItems;
    };

    const renderFoodsTable = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedFoods = foods.slice(startIndex, endIndex);

        return paginatedFoods.map((food, index) => (
            <tr key={index}>
                <td>{food.product_name}</td>
                <td>{food.carbohydrates_100g}</td>
                <td>{food.serving_size}</td>
                <td>
                    <button className="btn btn-warning btn-sm" onClick={() => handleEditClick(food)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(food.product_name)}>Delete</button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Foods CRUD Page</h1>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search for food"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Food</th>
                        <th>Carbohydrates (g per 100g)</th>
                        <th>Serving Size</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {renderFoodsTable()}
                </tbody>
            </table>
            <nav>
                <ul className="pagination justify-content-center">
                    {renderPagination()}
                </ul>
            </nav>
            <h2 className="mt-5">Add/Edit Food</h2>
            <form>
                <div className="form-group">
                    <label>Food Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="product_name"
                        value={editFood.product_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Carbohydrates (g per 100g)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="carbohydrates_100g"
                        value={editFood.carbohydrates_100g}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Serving Size</label>
                    <input
                        type="text"
                        className="form-control"
                        name="serving_size"
                        value={editFood.serving_size}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleSaveClick}>Save</button>
            </form>
        </div>
    );
}

export default FoodsCrudPage;
