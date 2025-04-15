// Monthly rainfall prediction data
const monthlyRainfall = {
    jan: { min: 40, max: 100 },
    feb: { min: 40, max: 60 },
    mar: { min: 0, max: 5 },
    apr: { min: 3, max: 13 },
    may: { min: 8, max: 12 },
    jun: { min: 40, max: 60 },
    jul: { min: 80, max: 140 },
    aug: { min: 100, max: 200 },
    sep: { min: 90, max: 190 },
    oct: { min: 200, max: 350 },
    nov: { min: 450, max: 1110 },
    dec: { min: 120, max: 440 }
};

// Historical flood data from SQL database
const historicalFloods = [
    { 
        date: "July 2020", 
        rainfall: 210,
        duration: 48,
        lakeLevel: 84.2,
        cause: "Monsoon surge caused by low-pressure system", 
        action: "Opened 3 floodgates at 50% capacity for 12 hours",
        impact: "Moderate flooding in low-lying areas",
        gatesOpened: 3,
        gatePercentage: 50
    },
    { 
        date: "November 2018", 
        rainfall: 180,
        duration: 24,
        lakeLevel: 83.5,
        cause: "Cyclone-induced precipitation", 
        action: "Emergency drainage protocol activated",
        impact: "Minor property damage",
        gatesOpened: 4,
        gatePercentage: 75
    },
    { 
        date: "September 2015", 
        rainfall: 150,
        duration: 36,
        lakeLevel: 82.8,
        cause: "Persistent heavy rains", 
        action: "Increased outflow by 30% for 24 hours",
        impact: "No significant damage",
        gatesOpened: 2,
        gatePercentage: 30
    },
    { 
        date: "October 2012", 
        rainfall: 190,
        duration: 72,
        lakeLevel: 84.5,
        cause: "Extended monsoon rains", 
        action: "Fully opened all gates for 8 hours",
        impact: "Significant flooding, agricultural damage",
        gatesOpened: 5,
        gatePercentage: 100
    },
    { 
        date: "August 2009", 
        rainfall: 165,
        duration: 60,
        lakeLevel: 83.9,
        cause: "Tropical storm", 
        action: "Partial gate opening (40%) for 18 hours",
        impact: "Minor street flooding",
        gatesOpened: 3,
        gatePercentage: 40
    }
];

// Initialize charts
function initializeCharts() {
    // Rain Prediction Chart
    const rainCtx = document.getElementById('rainChart').getContext('2d');
    new Chart(rainCtx, {
        type: 'line',
        data: {
            labels: Array(24).fill().map((_,i) => `${i}:00`),
            datasets: [{
                label: 'Rainfall (mm)',
                data: [0,0,0,2,5,8,12,15,14,10,7,5,4,3,2,1,0,0,0,0,0,0,0,0],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Rainfall (mm)'
                    }
                }
            }
        }
    });

    // Flood Risk Chart
    const floodRiskCtx = document.getElementById('floodRiskChart').getContext('2d');
    new Chart(floodRiskCtx, {
        type: 'doughnut',
        data: {
            labels: ['Safe', 'Moderate Risk', 'High Risk'],
            datasets: [{
                data: [65, 20, 15],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(243, 156, 18, 0.7)',
                    'rgba(231, 76, 60, 0.7)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(243, 156, 18, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // Simulation Chart
    const simCtx = document.getElementById('simulationChart').getContext('2d');
    new Chart(simCtx, {
        type: 'line',
        data: {
            labels: Array(24).fill().map((_,i) => `${i}:00`),
            datasets: [
                {
                    label: 'Lake Level (ft)',
                    data: Array(24).fill(83.0),
                    borderColor: 'rgba(52, 152, 219, 1)',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Safe Level',
                    data: Array(24).fill(84.5),
                    borderColor: 'rgba(46, 204, 113, 1)',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Lake Level Simulation',
                    font: { size: 14 }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 82,
                    max: 85,
                    title: {
                        display: true,
                        text: 'Lake Level (ft)'
                    }
                }
            }
        }
    });

    // Historical Chart
    const histCtx = document.getElementById('historicalChart').getContext('2d');
    new Chart(histCtx, {
        type: 'bar',
        data: {
            labels: historicalFloods.map(event => event.date),
            datasets: [{
                label: 'Rainfall (mm)',
                data: historicalFloods.map(event => event.rainfall),
                backgroundColor: historicalFloods.map(event => 
                    event.rainfall > 180 ? 'rgba(231, 76, 60, 0.7)' : 
                    event.rainfall > 150 ? 'rgba(243, 156, 18, 0.7)' : 'rgba(46, 204, 113, 0.7)'),
                borderColor: historicalFloods.map(event => 
                    event.rainfall > 180 ? 'rgba(231, 76, 60, 1)' : 
                    event.rainfall > 150 ? 'rgba(243, 156, 18, 1)' : 'rgba(46, 204, 113, 1)'),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Historical Flood Events by Rainfall',
                    font: { size: 14 }
                },
                tooltip: {
                    callbacks: {
                        afterBody: function(context) {
                            const data = historicalFloods[context[0].dataIndex];
                            return [
                                `Duration: ${data.duration} hours`,
                                `Lake Level: ${data.lakeLevel} ft`,
                                `Gates Opened: ${data.gatesOpened} (${data.gatePercentage}%)`,
                                `Cause: ${data.cause}`,
                                `Action: ${data.action}`,
                                `Impact: ${data.impact}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Rainfall (mm)'
                    }
                }
            }
        }
    });
}

// Show monthly rainfall prediction with random value within range
function showMonthlyPrediction() {
    const month = document.getElementById('month-select').value;
    const resultDiv = document.getElementById('monthly-prediction-result');
    
    if (month && monthlyRainfall[month]) {
        const data = monthlyRainfall[month];
        // Generate random value within the min-max range
        const randomValue = Math.floor(Math.random() * (data.max - data.min + 1)) + data.min;
        
        resultDiv.innerHTML = `
            <p><strong>Predicted Rainfall:</strong> ${randomValue}mm (range: ${data.min}mm to ${data.max}mm)</p>
            <p><strong>Typical Conditions:</strong> ${getMonthDescription(month)}</p>
        `;
    } else {
        resultDiv.innerHTML = '';
    }
}

function getMonthDescription(month) {
    const descriptions = {
        jan: "Cool with moderate rainfall",
        feb: "Cool with light rainfall",
        mar: "Dry season begins",
        apr: "Very light rainfall",
        may: "Pre-monsoon showers begin",
        jun: "Monsoon season starts",
        jul: "Heavy monsoon rains",
        aug: "Peak monsoon season",
        sep: "Monsoon begins to withdraw",
        oct: "Post-monsoon showers",
        nov: "Heavy rainfall in coastal areas",
        dec: "Cool with moderate rainfall"
    };
    return descriptions[month] || "Normal seasonal conditions";
}

// Flood prediction logic
function predictFlood() {
    // Get input values
    const rainfall = parseFloat(document.getElementById('rainfall').value);
    const duration = parseFloat(document.getElementById('duration').value);
    const inflow = parseFloat(document.getElementById('inflow').value);
    const outflow = parseFloat(document.getElementById('outflow').value);
    const level = parseFloat(document.getElementById('level').value);
    
    // Calculate risk factors
    const intensity = rainfall / duration; // mm/hour
    const netFlow = inflow - outflow; // cusecs
    const capacityMargin = 49.21 - level; // feet
    
    // Calculate risk score (0-10)
    const riskScore = Math.min(10, 
        (intensity * 0.4) +        // Rainfall intensity (40% weight)
        (netFlow * 0.3) +          // Net flow (30% weight)
        ((49.21 - capacityMargin)/49.21 * 0.3) // Capacity margin (30% weight)
    );
    
    // Determine risk level
    let riskLevel, riskColor;
    if (riskScore > 8) {
        riskLevel = "Extreme";
        riskColor = "var(--danger)";
    } else if (riskScore > 6) {
        riskLevel = "High";
        riskColor = "var(--warning)";
    } else if (riskScore > 4) {
        riskLevel = "Moderate";
        riskColor = "#f1c40f";
    } else {
        riskLevel = "Low";
        riskColor = "var(--safe)";
    }
    
    // Display result
    const resultDiv = document.getElementById('prediction-result');
    
    resultDiv.innerHTML = `
        <div style="padding: 20px; border-radius: 5px; background: #fff; border-left: 5px solid ${riskColor}">
            <h3 style="margin-top: 0; color: ${riskColor}">${riskLevel} Flood Risk (${riskScore.toFixed(1)}/10)</h3>
            
            <div class="risk-indicator">
                <div class="risk-marker" style="left: ${riskScore * 10}%"></div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h4>Key Factors</h4>
                    <ul>
                        <li>Rain intensity: ${intensity.toFixed(1)} mm/h</li>
                        <li>Net inflow: ${netFlow.toFixed(1)} cusecs</li>
                        <li>Capacity margin: ${capacityMargin.toFixed(1)} ft</li>
                    </ul>
                </div>
                <div>
                    <h4>Recommendations</h4>
                    ${getRecommendations(riskScore, netFlow, capacityMargin)}
                </div>
            </div>
        </div>
    `;
    
    // Update flood risk chart
    updateFloodRiskChart(riskScore * 10);
    
    // Show historical matches
    showHistoricalMatches(rainfall, duration);
}

function updateFloodRiskChart(prediction) {
    const safe = 100 - prediction;
    const mod = prediction > 50 ? prediction - 50 : 0;
    const high = prediction > 75 ? prediction - 75 : 0;
    
    const chart = Chart.getChart("floodRiskChart");
    chart.data.datasets[0].data = [safe, mod, high];
    chart.update();
}

function getRecommendations(riskScore, netFlow, capacityMargin) {
    if (riskScore > 8) {
        return `
            <ul>
                <li>Immediately increase outflow by ${Math.round(netFlow * 1.5)} cusecs</li>
                <li>Activate emergency response teams</li>
                <li>Issue public flood warnings</li>
                <li>Prepare evacuation plans for low-lying areas</li>
            </ul>
        `;
    } else if (riskScore > 6) {
        return `
            <ul>
                <li>Increase outflow by ${Math.round(netFlow * 1.2)} cusecs</li>
                <li>Monitor levels hourly</li>
                <li>Alert local authorities</li>
                <li>Prepare flood barriers</li>
            </ul>
        `;
    } else if (riskScore > 4) {
        return `
            <ul>
                <li>Increase outflow by ${Math.round(netFlow * 0.8)} cusecs</li>
                <li>Monitor levels every 2 hours</li>
                <li>Check drainage systems</li>
            </ul>
        `;
    } else {
        return `
            <ul>
                <li>Maintain current outflow</li>
                <li>Monitor levels every 4 hours</li>
                <li>Standard operating procedures</li>
            </ul>
        `;
    }
}

// Run digital twin simulation
function runSimulation() {
    const rainfall = parseFloat(document.getElementById('sim-rainfall').value);
    const duration = parseFloat(document.getElementById('sim-duration').value);
    const level = parseFloat(document.getElementById('sim-level').value);
    const gates = parseFloat(document.getElementById('sim-gates').value);
    
    // Calculate simulated outcomes
    const intensity = rainfall / duration;
    const riskScore = Math.min(100, 
        (intensity * 2) + 
        ((level/85.4)*100 * 0.8) - 
        (gates * 0.5)
    );
    
    // Generate simulation data
    const baseLevel = level;
    const maxLevel = Math.min(85.4, baseLevel + (rainfall * 0.1) - (gates * 0.05));
    const levels = Array(24).fill().map((_,i) => {
        if (i < 6) return baseLevel;
        if (i < 18) return baseLevel + (i-6) * ((maxLevel-baseLevel)/12);
        return maxLevel - (i-18) * ((maxLevel-baseLevel)/6);
    });
    
    // Update simulation chart
    const chart = Chart.getChart("simulationChart");
    chart.data.datasets[0].data = levels;
    chart.options.scales.y.min = Math.max(80, baseLevel - 2);
    chart.options.scales.y.max = Math.min(86, maxLevel + 1);
    chart.update();
    
    // Display results
    const resultDiv = document.getElementById('simulation-result');
    let riskLevel, riskColor;
    if (riskScore > 75) {
        riskLevel = "Extreme";
        riskColor = "var(--danger)";
    } else if (riskScore > 50) {
        riskLevel = "High";
        riskColor = "var(--warning)";
    } else if (riskScore > 25) {
        riskLevel = "Moderate";
        riskColor = "#f1c40f";
    } else {
        riskLevel = "Low";
        riskColor = "var(--safe)";
    }
    
    resultDiv.innerHTML = `
        <div style="padding: 15px; border-radius: 5px; background: #fff; border-left: 5px solid ${riskColor}">
            <h3 style="margin-top: 0; color: ${riskColor}">Simulation Result: ${riskLevel} Flood Risk (${riskScore.toFixed(1)}%)</h3>
            <p><strong>Peak Lake Level:</strong> ${maxLevel.toFixed(2)} ft (${((maxLevel/85.4)*100).toFixed(1)}% capacity)</p>
            <p><strong>Risk Factors:</strong></p>
            <ul>
                <li>Rain intensity: ${intensity.toFixed(1)} mm/h</li>
                <li>Initial level: ${level.toFixed(1)} ft (${((level/85.4)*100).toFixed(1)}% capacity)</li>
                <li>Gate opening: ${gates}%</li>
            </ul>
        </div>
    `;
}

// Search historical events
function searchHistoricalEvents() {
    const minRainfall = parseFloat(document.getElementById('search-rainfall').value) || 0;
    const minDuration = parseFloat(document.getElementById('search-duration').value) || 0;
    const maxLevel = parseFloat(document.getElementById('search-level').value) || 100;
    
    const filteredEvents = historicalFloods.filter(event => 
        event.rainfall >= minRainfall && 
        event.duration >= minDuration && 
        event.lakeLevel <= maxLevel
    );
    
    displayHistoricalEvents(filteredEvents);
}

// Show similar historical events
function showHistoricalMatches(rainfall, duration) {
    const intensity = rainfall / duration;
    const eventsContainer = document.getElementById('historical-events');
    
    // Find similar historical events (within 20% of current intensity)
    const similarEvents = historicalFloods.filter(event => {
        const eventIntensity = event.rainfall / event.duration;
        return Math.abs(eventIntensity - intensity) / intensity < 0.2;
    });
    
    displayHistoricalEvents(similarEvents);
}

function displayHistoricalEvents(events) {
    const container = document.getElementById('historical-events');
    
    if (events.length > 0) {
        container.innerHTML = `
            <h4>Found ${events.length} Matching Historical Events</h4>
            ${events.map(event => `
                <div class="historical-incident">
                    <h5>${event.date} (${event.rainfall}mm over ${event.duration} hours)</h5>
                    <p><strong>Lake Level:</strong> ${event.lakeLevel} ft</p>
                    <p><strong>Gates Opened:</strong> ${event.gatesOpened} (${event.gatePercentage}%)</p>
                    <p><strong>Cause:</strong> ${event.cause}</p>
                    <p><strong>Action Taken:</strong> ${event.action}</p>
                    <p><strong>Impact:</strong> ${event.impact}</p>
                </div>
            `).join('')}
        `;
    } else {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h4>No Matching Historical Events Found</h4>
                <p>Try broadening your search criteria</p>
            </div>
        `;
    }
}

// Make table cells editable
function makeEditable(cell) {
    const currentValue = cell.textContent;
    cell.innerHTML = `<input type="text" value="${currentValue}" onblur="saveValue(this)" style="width:100%; padding:5px; border:1px solid #ddd;">`;
    cell.querySelector('input').focus();
}

function saveValue(input) {
    const newValue = input.value;
    const cell = input.parentElement;
    cell.textContent = newValue;
    cell.classList.add('editable-value');
    cell.setAttribute('onclick', 'makeEditable(this)');
}

// Show emergency contacts with random phone numbers
function showEmergencyContacts() {
    const contactsDiv = document.getElementById('emergency-contacts');
    if (contactsDiv.style.display === 'none') {
        // Generate random phone numbers
        const random1 = Math.floor(100 + Math.random() * 900);
        const random2 = Math.floor(100 + Math.random() * 900);
        document.getElementById('contact1').textContent = `+1 (555) ${random1}-${Math.floor(1000 + Math.random() * 9000)}`;
        document.getElementById('contact2').textContent = `+1 (555) ${random2}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        contactsDiv.style.display = 'block';
    } else {
        contactsDiv.style.display = 'none';
    }
}
// Lake selection functionality
function selectLake(lakeName) {
    // Update active state in scroller
    document.querySelectorAll('.lake-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lake === lakeName) {
            option.classList.add('active');
        }
    });
    
    // Update topographic image
    document.getElementById('lake-image').src = `images/${lakeName}.jpg`;
    
    // Here you could also update lake-specific data if needed
    updateLakeData(lakeName);
}

function updateLakeData(lakeName) {
    // This function would update all the lake-specific data in your dashboard
    // You would implement this based on your actual data structure
    console.log(`Loading data for ${lakeName}`);
    
    // Example: Update the lake name in the conditions section
    // document.querySelector('#current-conditions h3').textContent = `${lakeName} Conditions`;
}

// Initialize the application
window.onload = function() {
    initializeCharts();
    predictFlood();
    
    // Set up event listeners
    document.getElementById('month-select').addEventListener('change', showMonthlyPrediction);
    document.getElementById('predict-flood').addEventListener('click', predictFlood);
    document.getElementById('run-simulation').addEventListener('click', runSimulation);
    document.getElementById('search-events').addEventListener('click', searchHistoricalEvents);
    document.getElementById('emergency-alert').addEventListener('click', showEmergencyContacts);
    
    // Make editable cells clickable
    document.querySelectorAll('.editable-value').forEach(cell => {
        cell.addEventListener('click', function() {
            makeEditable(this);
        });
    });
    
    // Simulate live weather updates
    setInterval(() => {
        const conditions = [
            {icon: '☀️', text: 'Sunny', temp: 25 + Math.random() * 8},
            {icon: '🌧️', text: 'Rainy', temp: 20 + Math.random() * 5},
            {icon: '⛅', text: 'Cloudy', temp: 22 + Math.random() * 6},
            {icon: '🌪️', text: 'Windy', temp: 18 + Math.random() * 7}
        ];
        const weather = conditions[Math.floor(Math.random() * conditions.length)];
        
        document.getElementById('weather-condition').textContent = weather.text;
        document.getElementById('weather-temp').textContent = `${weather.temp.toFixed(1)}°C`;
        document.querySelector('.weather-icon').textContent = weather.icon;
    }, 5000);
};