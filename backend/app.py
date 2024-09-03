from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import requests
from googletrans import Translator
import os
from werkzeug.utils import secure_filename
import speech_recognition as sr
from gtts import gTTS
import pygame
import tempfile

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///problems.db'  
app.config['UPLOAD_FOLDER'] = 'uploads/' 
app.config['AUDIO_FOLDER'] = 'audio/'  # Folder to store audio files
db = SQLAlchemy(app)

# uploadss
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

if not os.path.exists(app.config['AUDIO_FOLDER']):
    os.makedirs(app.config['AUDIO_FOLDER'])

# Mock datass
parking_data = [
    {"id": 1,"name": "Phoenix Marketcity Bangalore", "latitude": 12.9966, "longitude": 77.6967, "available_spots": 1000},
    {"id": 2,"name": "Orion Mall", "latitude": 13.0115, "longitude": 77.5549, "available_spots": 1200},
    {"id": 3,"name": "UB City", "latitude": 12.9716, "longitude": 77.5952, "available_spots": 500},
    {"id": 4,"name": "Forum Mall Koramangala", "latitude": 12.9356, "longitude": 77.6121, "available_spots": 800},
    {"id": 5,"name": "Mantri Square Mall", "latitude": 12.9917, "longitude": 77.5703, "available_spots": 1500},
    {"id": 6,"name": "Garuda Mall", "latitude": 12.9719, "longitude": 77.6094, "available_spots": 700},
    {"id": 7,"name": "VR Bengaluru", "latitude": 12.9932, "longitude": 77.6959, "available_spots": 600},
    {"id": 8,"name": "Inorbit Mall", "latitude": 12.9279, "longitude": 77.6753, "available_spots": 1000},
    {"id": 9,"name": "Central Mall", "latitude": 12.9303, "longitude": 77.6141, "available_spots": 300},
    {"id": 10,"name": "Bangalore Central Mall JP Nagar", "latitude": 12.9077, "longitude": 77.5951, "available_spots": 400},
    {"id": 11,"name": "Royal Meenakshi Mall", "latitude": 12.8752, "longitude": 77.6024, "available_spots": 500},
    {"id": 12,"name": "Total Mall Sarjapur", "latitude": 12.9108, "longitude": 77.6476, "available_spots": 600},
    {"id": 13,"name": "Elements Mall", "latitude": 13.0287, "longitude": 77.6431, "available_spots": 800},
    {"id": 14,"name": "Gopalan Mall Old Madras Road", "latitude": 12.9938, "longitude": 77.6521, "available_spots": 700},
    {"id": 15,"name": "Esteem Mall", "latitude": 13.0498, "longitude": 77.5855, "available_spots": 500},
    {"id": 16,"name": "1 MG-Lido Mall", "latitude": 12.9737, "longitude": 77.6195, "available_spots": 300},
    {"id": 17,"name": "Sigma Mall", "latitude": 12.9883, "longitude": 77.5908, "available_spots": 200},
    {"id": 18,"name": "Bangalore Central Bellandur", "latitude": 12.9294, "longitude": 77.6784, "available_spots": 400},
    {"id": 19,"name": "Ascendas Park Square Mall", "latitude": 12.9879, "longitude": 77.7303, "available_spots": 600},
    {"id": 20,"name": "Gopalan Innovation Mall", "latitude": 12.9089, "longitude": 77.6092, "available_spots": 500},
    {"id": 21,"name": "RMZ Galleria Mall", "latitude": 13.1235, "longitude": 77.5868, "available_spots": 700},
    {"id": 22,"name": "Soul Space Spirit Mall", "latitude": 12.9209, "longitude": 77.6595, "available_spots": 400},
    {"id": 23,"name": "Westside Mall", "latitude": 12.9718, "longitude": 77.6413, "available_spots": 300},
    {"id": 24,"name": "Commercial Street", "latitude": 12.9823, "longitude": 77.6070, "available_spots": 200},
    {"id": 25,"name": "Brigade Road", "latitude": 12.9757, "longitude": 77.6095, "available_spots": 300},
    {"id": 26,"name": "M.G. Road", "latitude": 12.9734, "longitude": 77.6200, "available_spots": 400},
    {"id": 27,"name": "Jayanagar 4th Block", "latitude": 12.9250, "longitude": 77.5830, "available_spots": 500},
    {"id": 28,"name": "Koramangala 5th Block", "latitude": 12.9352, "longitude": 77.6228, "available_spots": 600},
    {"id": 29,"name": "Chickpet Market", "latitude": 12.9635, "longitude": 77.5800, "available_spots": 100},
    {"id": 30,"name": "Gandhi Bazaar", "latitude": 12.9451, "longitude": 77.5733, "available_spots": 150},
    {"id": 31,"name": "Residency Road", "latitude": 12.9725, "longitude": 77.6075, "available_spots": 250},
    {"id": 32,"name": "Russell Market", "latitude": 12.9877, "longitude": 77.6036, "available_spots": 200},
    {"id": 33,"name": "Kammanahalli Main Road", "latitude": 13.0185, "longitude": 77.6415, "available_spots": 300},
    {"id": 34,"name": "HSR Layout Sector 7", "latitude": 12.9104, "longitude": 77.6419, "available_spots": 400},
    {"id": 35,"name": "Vasanth Nagar", "latitude": 12.9931, "longitude": 77.5914, "available_spots": 250},
    {"id": 36,"name": "Malleswaram 8th Cross", "latitude": 13.0012, "longitude": 77.5713, "available_spots": 350},
    {"id": 37,"name": "Basavanagudi", "latitude": 12.9416, "longitude": 77.5688, "available_spots": 200},
    {"id": 38,"name": "Rajajinagar 4th Block", "latitude": 12.9982, "longitude": 77.5537, "available_spots": 300},
    {"id": 39,"name": "Shivajinagar", "latitude": 12.9825, "longitude": 77.6033, "available_spots": 200},
    {"id": 40,"name": "Banashankari 2nd Stage", "latitude": 12.9259, "longitude": 77.5668, "available_spots": 250},
    {"id": 41,"name": "Frazer Town", "latitude": 13.0020, "longitude": 77.6200, "available_spots": 300},
    {"id": 42,"name": "Indiranagar 100 Feet Road", "latitude": 12.9710, "longitude": 77.6412, "available_spots": 400},
    {"id": 43,"name": "Ulsoor", "latitude": 12.9848, "longitude": 77.6176, "available_spots": 200},
    {"id": 44,"name": "Whitefield Main Road", "latitude": 12.9698, "longitude": 77.7499, "available_spots": 350},
    {"id": 45,"name": "J.P. Nagar 2nd Phase", "latitude": 12.9132, "longitude": 77.5851, "available_spots": 250},
    {"id": 46,"name": "Kalyan Nagar", "latitude": 13.0255, "longitude": 77.6425, "available_spots": 300},
    {"id": 47,"name": "RT Nagar Main Road", "latitude": 13.0211, "longitude": 77.5885, "available_spots": 200},
    {"id": 48,"name": "BTM Layout 2nd Stage", "latitude": 12.9166, "longitude": 77.6101, "available_spots": 400},
    {"id": 49,"name": "Peenya Industrial Area", "latitude": 13.0258, "longitude": 77.5150, "available_spots": 500},
    {"id": 50,"name": "Electronic City Phase 1", "latitude": 12.8415, "longitude": 77.6635, "available_spots": 400},
    {"id": 51,"name": "Sarjapur Road", "latitude": 12.9082, "longitude": 77.6815, "available_spots": 300},
    {"id": 52,"name": "Domlur Layout", "latitude": 12.9597, "longitude": 77.6410, "available_spots": 250},
    {"id": 53,"name": "Yelahanka New Town", "latitude": 13.1010, "longitude": 77.5964, "available_spots": 300},
    {"id": 54,"name": "Baiyappanahalli Metro Station", "latitude": 12.9901, "longitude": 77.6382, "available_spots": 300},
    {"id": 55,"name": "M.G. Road Metro Station", "latitude": 12.9759, "longitude": 77.6069, "available_spots": 200},
    {"id": 56,"name": "Yeshwanthpur Metro Station", "latitude": 13.0285, "longitude": 77.5401, "available_spots": 250},
    {"id": 57,"name": "Kempegowda Bus Station", "latitude": 12.9784, "longitude": 77.5717, "available_spots": 400},
    {"id": 58,"name": "Shivajinagar Bus Station", "latitude": 12.9836, "longitude": 77.6057, "available_spots": 200},
    {"id": 59,"name": "K.R. Market", "latitude": 12.9622, "longitude": 77.5776, "available_spots": 150},
    {"id": 60,"name": "Majestic Bus Station", "latitude": 12.9755, "longitude": 77.5772, "available_spots": 300}
]


class Problem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    image_filename = db.Column(db.String(255), nullable=False)


with app.app_context():
    db.create_all()

@app.route('/parking', methods=['GET'])
def get_parking_data():
    return jsonify(parking_data)

@app.route('/book', methods=['POST'])
def book_parking():
    data = request.get_json()
    parking_id = data.get('id')
    hours = data.get('hours')
    
    for parking in parking_data:
        if parking['id'] == parking_id and parking['available_spots'] > 0:
            parking['available_spots'] -= 1
            return jsonify({"message": "Booking confirmed", "hours": hours}), 200
    return jsonify({"message": "Booking failed"}), 400

@app.route('/news', methods=['GET'])
def get_news():
    country_code = request.args.get('country_code')
    preferred_language = request.args.get('language_code')
    
    #apis 
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "apiKey": "8b56edb865d041508feb36a79abf2766",
        "country": country_code,
        "category": "business"
    }
  
    response = requests.get(url, params=params)
    
   
    if response.status_code == 200:
       
        data = response.json()
        
       
        articles = data["articles"]
        
       
        translator = Translator()
        
       
        translated_titles = []
        for article in articles:
            title = article["title"]
            translated = translator.translate(title, dest=preferred_language)
            translated_title = translated.text
            translated_titles.append(translated_title)
        
        return jsonify(translated_titles)
    else:
        return jsonify({"error": response.status_code}), response.status_code

@app.route('/problems', methods=['POST'])
def report_problem():
    description = request.form['description']
    location = request.form['location']
    file = request.files['file']

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        new_problem = Problem(description=description, location=location, image_filename=filename)
        db.session.add(new_problem)
        db.session.commit()

        return jsonify({"message": "Problem reported successfully"}), 201
    else:
        return jsonify({"error": "File upload failed"}), 400

@app.route('/recognize_and_translate_speech', methods=['POST'])
def recognize_and_translate_speech():
    try:
        target_language = request.json.get('target_language', 'hi')
        text_to_translate = "Hello, this is a test translation."

        tts = gTTS(text=text_to_translate, lang=target_language)
        _, temp_audio_path = tempfile.mkstemp(suffix='.mp3')
        tts.save(temp_audio_path)

        return send_file(temp_audio_path, as_attachment=True)

    except Exception as e:
        print(f"Error in recognize_and_translate_speech: {e}")
        return {'error': 'An error occurred during speech recognition and translation.'}, 500

    finally:
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)

if __name__ == '__main__':
    app.run(debug=True)
