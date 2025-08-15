// whatif.js - Boosted What-If Simulator with smaller chart size
document.addEventListener("DOMContentLoaded", () => {
    const ageSlider = document.getElementById("sim_age");
    const weightSlider = document.getElementById("sim_weight");
    const insulinSlider = document.getElementById("sim_insulin");

    const ageValue = document.getElementById("ageVal");
    const weightValue = document.getElementById("weightVal");
    const insulinValue = document.getElementById("insulinVal");

    const ctx = document.getElementById("riskChart").getContext("2d");

    // Function to boost probability for demo purposes
    function applyBoost(prob, age, weight) {
        let boost = 1;
        if (age > 50) boost += (age - 50) * 0.02;        // +2% per year after 50
        if (weight > 80) boost += (weight - 80) * 0.015; // +1.5% per kg after 80
        return Math.min(prob * boost, 1); // cap at 100%
    }

    // Create Chart.js chart
    const riskChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Predicted Diabetes Risk",
                data: [],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
           
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    title: {
                        display: true,
                        text: "Risk Probability"
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Fetch and update risk prediction
    async function updateRiskChart() {
        ageValue.textContent = ageSlider.value;
        weightValue.textContent = weightSlider.value;
        insulinValue.textContent = insulinSlider.value;

        try {
            const response = await fetch("/whatif_predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Age: ageSlider.value,
                    BMI: (weightSlider.value / 1.75 / 1.75).toFixed(1), // assume height = 1.75m
                    Insulin: insulinSlider.value
                })
            });

            const result = await response.json();

            if (result.probability !== undefined) {
                const boostedProb = applyBoost(
                    result.probability,
                    parseFloat(ageSlider.value),
                    parseFloat(weightSlider.value)
                );

                const timestamp = new Date().toLocaleTimeString();

                // Add new boosted data point
                riskChart.data.labels.push(timestamp);
                riskChart.data.datasets[0].data.push(boostedProb);

                // Keep only last 10 points
                if (riskChart.data.labels.length > 10) {
                    riskChart.data.labels.shift();
                    riskChart.data.datasets[0].data.shift();
                }

                riskChart.update();
            }
        } catch (err) {
            console.error("Error fetching risk data:", err);
        }
    }

    // Attach event listeners
    ageSlider.addEventListener("input", updateRiskChart);
    weightSlider.addEventListener("input", updateRiskChart);
    insulinSlider.addEventListener("input", updateRiskChart);

    // Initial chart load
    updateRiskChart();
});
