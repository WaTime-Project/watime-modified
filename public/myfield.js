// Define the irrigationData function globally for Alpine.js
function irrigationData() {

    
    return {
        temperature: "25°C",
        forecast: "Sunny",
        nextWatering: "Tomorrow, 5:00 AM",
        alerts: "System is ready.", // Single definition for alerts
        isIrrigating: false, // Track if irrigation is running
        status: "All good",

        startIrrigation() {
            this.isIrrigating = true;
            this.alerts = "Irrigation started!";
            
        },

        stopIrrigation() {
            this.isIrrigating = false;
            this.alerts = "Irrigation stopped!";
            
        }
    }
}

// Use DOMContentLoaded for non-Alpine.js specific operations like chart rendering
document.addEventListener('DOMContentLoaded', function() {
    // Water Usage Chart
    const ctxWaterUsage = document.getElementById('waterUsageChart').getContext('2d');
    const waterUsageChart = new Chart(ctxWaterUsage, {
        type: 'line',
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [{
                label: 'Water Usage (Liters)',
                data: [1200, 1100, 1000, 1300, 1200, 1400, 220],
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Moisture Level Chart
    const ctxMoistureLevel = document.getElementById('moistureLevelChart').getContext('2d');
    const moistureLevelChart = new Chart(ctxMoistureLevel, {
        type: 'bar',
        data: {
            labels: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'],
            datasets: [{
                label: 'Moisture Level (%)',
                data: [45, 50, 42, 48],
                backgroundColor: 'rgba(40, 167, 69, 0.2)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
