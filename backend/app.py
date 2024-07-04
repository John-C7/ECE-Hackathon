from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock data 
parking_data = [
    {"name": "Parking Lot 1", "latitude": 12.9716, "longitude": 77.5946, "available_spots": 10},
    {"name": "Parking Lot 2", "latitude": 12.9352, "longitude": 77.6245, "available_spots": 5},
    {"name": "Parking Lot 3", "latitude": 12.9279, "longitude": 77.6271, "available_spots": 2},
    {"name": "Parking Lot 4", "latitude": 12.9719, "longitude": 77.6412, "available_spots": 0}
]

@app.route('/parking', methods=['GET'])
def get_parking_data():
    return jsonify(parking_data)

if __name__ == '__main__':
    app.run(debug=True)
