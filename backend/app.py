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

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///problems.db'  # Adjust as necessary
app.config['UPLOAD_FOLDER'] = 'uploads/'  # Folder to store uploaded images
app.config['AUDIO_FOLDER'] = 'audio/'  # Folder to store audio files
db = SQLAlchemy(app)

# Ensure the upload and audio folders exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

if not os.path.exists(app.config['AUDIO_FOLDER']):
    os.makedirs(app.config['AUDIO_FOLDER'])

# Mock data for parking
parking_data = [
    {"name": "Parking Lot 1", "latitude": 12.9716, "longitude": 77.5946, "available_spots": 10},
    {"name": "Parking Lot 2", "latitude": 12.9352, "longitude": 77.6245, "available_spots": 5},
    {"name": "Parking Lot 3", "latitude": 12.9279, "longitude": 77.6271, "available_spots": 2},
    {"name": "Parking Lot 4", "latitude": 12.9719, "longitude": 77.6412, "available_spots": 0}
]

# SQLAlchemy model for storing problems
class Problem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    image_filename = db.Column(db.String(255), nullable=False)

# Create all tables and database schema
with app.app_context():
    db.create_all()

@app.route('/parking', methods=['GET'])
def get_parking_data():
    return jsonify(parking_data)

@app.route('/news', methods=['GET'])
def get_news():
    country_code = request.args.get('country_code')
    preferred_language = request.args.get('language_code')
    
    # Set up the API endpoint and parameters
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "apiKey": "8b56edb865d041508feb36a79abf2766",
        "country": country_code,
        "category": "business"
    }
    
    # Make the API request
    response = requests.get(url, params=params)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        
        # Access the articles from the response
        articles = data["articles"]
        
        # Initialize the translator
        translator = Translator()
        
        # Translate the titles of the articles
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
    recognizer = sr.Recognizer()
    mic = sr.Microphone()
    target_language = request.json.get('target_language')

    with mic as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    try:
        speech_text = recognizer.recognize_google(audio)

        # Translate the recognized text
        translator = Translator()
        translated = translator.translate(speech_text, dest=target_language)
        translated_text = translated.text

        # Convert translated text to speech
        tts = gTTS(text=translated_text, lang=target_language)
        audio_filename = "translated_speech.mp3"
        audio_path = os.path.join(app.config['AUDIO_FOLDER'], audio_filename)
        tts.save(audio_path)

        return send_file(audio_path, as_attachment=True)
    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand the audio."}), 400
    except sr.RequestError:
        return jsonify({"error": "Could not request results from Google Speech Recognition service."}), 500

if __name__ == '__main__':
    app.run(debug=True)
