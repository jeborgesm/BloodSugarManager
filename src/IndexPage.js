import React, { useState, useCallback, useMemo } from 'react';

function IndexPage() {
    const [carbInputs, setCarbInputs] = useState([{ food: '', carbs: 0 }]);
    const [ratio, setRatio] = useState(20);
    const [currentBloodSugar, setCurrentBloodSugar] = useState(0);
    const [correctionInsulin, setCorrectionInsulin] = useState(0);
    const [highBloodSugarInsulin, setHighBloodSugarInsulin] = useState(0);

    const totalCarbs = useMemo(() => {
        return carbInputs.reduce((sum, input) => sum + parseFloat(input.carbs || 0), 0);
    }, [carbInputs]);

    const carbInsulin = useMemo(() => {
        return (totalCarbs / ratio).toFixed(2);
    }, [totalCarbs, ratio]);

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

    return (
        <div className="container mt-4">
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
                        <td id="totalCarbs">{totalCarbs}</td>
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
                            Total grams of carbohydrate: <input type="number" id="totalCarbInput" value={totalCarbs} className="form-control d-inline-block w-auto" readOnly /> g /
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
                        <h5 className="card-title"></h5>
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

export default IndexPage;
