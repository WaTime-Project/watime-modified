from flask import Flask, request, jsonify
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)

try:
    with open('model.pkl', 'rb') as file:
        model = pickle.load(file)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.json
        features = data.get('features')
        
        if not features:
            return jsonify({'error': 'No features provided'}), 400

        features = np.array(features).reshape(1, -1)

        features = pd.DataFrame(features, columns=['temperature_2m (°C)', 'relative_humidity_2m (%)', 'rain (mm)', 'surface_pressure (hPa)', 'cloud_cover (%)', 'wind_direction_10m (°)', 'snowfall(mm)', 'wind_speed(m/s)', 'wind_gust(m/s)']) 

        prediction = model.predict(features)[0]
        return jsonify({'prediction': prediction})

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)

