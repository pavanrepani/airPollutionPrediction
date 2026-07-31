async function predict() {

    // Validate inputs
    const fields = [
        "temperature",
        "humidity",
        "pm25",
        "pm10",
        "no2",
        "so2",
        "co",
        "industry",
        "population"
    ];

    for (const field of fields) {
        if (document.getElementById(field).value === "") {
            alert("Please fill all fields.");
            return;
        }
    }

    const response = await fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            temperature: document.getElementById("temperature").value,
            humidity: document.getElementById("humidity").value,
            pm25: document.getElementById("pm25").value,
            pm10: document.getElementById("pm10").value,
            no2: document.getElementById("no2").value,
            so2: document.getElementById("so2").value,
            co: document.getElementById("co").value,
            industry: document.getElementById("industry").value,
            population: document.getElementById("population").value
        })
    });

    // This line is VERY IMPORTANT
    const data = await response.json();

    document.getElementById("prediction").innerHTML = data.prediction;
    document.getElementById("confidence").innerHTML = data.confidence + "%";
    document.getElementById("recommendation").innerHTML = data.recommendation;

    const box = document.getElementById("recommendationBox");

    if (data.prediction === "Good") {
        box.className = "alert alert-success mt-3";
    } else if (data.prediction === "Moderate") {
        box.className = "alert alert-warning mt-3";
    } else if (data.prediction === "Poor") {
        box.className = "alert alert-danger mt-3";
    } else {
        box.className = "alert alert-dark mt-3";
    }

    document.getElementById("confidenceBar").style.width = data.confidence + "%";
    document.getElementById("confidenceBar").innerHTML = data.confidence + "%";
}