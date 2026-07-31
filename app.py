from flask import Flask, render_template, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

# Load model
model = joblib.load("pollution_model.pkl")
label_encoder = joblib.load("label_encoder.pkl")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    sample = pd.DataFrame({
        "Temperature": [float(data["temperature"])],
        "Humidity": [float(data["humidity"])],
        "PM2.5": [float(data["pm25"])],
        "PM10": [float(data["pm10"])],
        "NO2": [float(data["no2"])],
        "SO2": [float(data["so2"])],
        "CO": [float(data["co"])],
        "Proximity_to_Industrial_Areas": [float(data["industry"])],
        "Population_Density": [float(data["population"])]
    })

    prediction = model.predict(sample)

    probability = model.predict_proba(sample)

    confidence = round(max(probability[0]) * 100, 2)

    result = label_encoder.inverse_transform(prediction)[0]


    recommendations = {
        "Good": "Air quality is good. Enjoy outdoor activities.",
        "Moderate": "Sensitive people should limit prolonged outdoor activity.",
        "Poor": "Wear a mask if going outside.",
        "Hazardous": "Stay indoors and avoid outdoor activities."
    }

    recommendation = recommendations.get(
        result,
        "No recommendation available."
    )

    return jsonify({
        "prediction": result,
        "confidence": confidence,
        "recommendation": recommendation
    })


if __name__ == "__main__":
    app.run(debug=True)