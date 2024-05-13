from flask import Flask, render_template, request, jsonify
from keras.models import load_model
from PIL import Image
import io
import base64
import numpy as np
import tensorflow as tf


app = Flask(__name__)

model = load_model('model4.h5')
class_labels = ['A', 'Ae', 
                'Ba', 'Bae', 'Be', 'Beo', 'Beu', 'Bi', 'Bo', 'Bu', 'Bya', 'Bye', 'Byeo', 'Byo', 'Byu', 
                'Cha', 'Chae', 'Che', 'Cheo', 'Cheu', 'Chi', 'Cho', 'Chu', 'Chya', 'Chye', 'Chyeo', 'Chyo', 'Chyu', 
                'Da', 'Dae', 'De', 'Deo', 'Deu', 'Di', 'Do', 'Du', 'Dya', 'Dye', 'Dyeo', 'Dyo', 'Dyu', 
                'E', 'Eo', 'Eu', 
                'Ga', 'Gae', 'Ge', 'Geo', 'Geu', 'Gi','Go', 'Gu', 'Gya', 'Gye', 'Gyeo', 'Gyo', 'Gyu', 
                'Ha', 'Hae', 'He', 'Heo', 'Heu', 'Hi', 'Ho', 'Hu', 'Hya', 'Hye', 'Hyeo', 'Hyo', 'Hyu', 'I', 
                'Ja', 'Jae', 'Je', 'Jeo', 'Jeu', 'Ji', 'Jo', 'Ju', 'Jya', 'Jye', 'Jyeo', 'Jyo', 'Jyu', 
                'Ka', 'Kae', 'Ke', 'Keo', 'Keu', 'Ki', 'Ko', 'Ku', 'Kya', 'Kye', 'Kyeo', 'Kyo', 'Kyu', 
                'Ma', 'Mae', 'Me', 'Meo', 'Meu', 'Mi', 'Mo', 'Mu', 'Mya', 'Mye', 'Myeo', 'Myo', 'Myu',
                'Na', 'Nae', 'Ne', 'Neo', 'Neu', 'Ni', 'No', 'Nu', 'Nya', 'Nye', 'Nyeo', 'Nyo', 'Nyu', 'O', 
                'Pa', 'Pae', 'Pe', 'Peo', 'Peu', 'Pi', 'Po', 'Pu', 'Pya', 'Pye', 'Pyeo', 'Pyo', 'Pyu', 
                'Ra', 'Rae', 'Re', 'Reo', 'Reu', 'Ri', 'Ro', 'Ru', 'Rya', 'Rye', 'Ryeo', 'Ryo', 'Ryu', 
                'Sa', 'Sae', 'Se', 'Seo', 'Seu', 'Si', 'So', 'Su', 'Sya', 'Sye', 'Syeo', 'Syo', 'Syu', 
                'Ta', 'Tae', 'Te', 'Teo', 'Teu', 'Ti', 'To', 'Tu', 'Tya', 'Tye', 'Tyeo', 'Tyo', 'Tyu', 'U', 
                'Ya', 'Ye', 'Yeo', 'Yo', 'Yu']

@app.route("/")
def main():
    return render_template('index.html')

@app.route('/latihan')
def tutorial():
    return render_template('latihan.html')

@app.route('/huruf-konsonan')
def huruf_konsonan():
    return render_template('huruf-konsonan.html')

@app.route('/huruf-vokal')
def huruf_vokal():
    return render_template('huruf-vokal.html')

@app.route('/penulisan-silabel')
def penulisan_silabel():
    return render_template('penulisan-silabel.html')

@app.route('/process_image', methods=['POST'])
def process_image():
    data = request.json
    image_data = data['image_data'].split(',')[1]  
    
    # Dekode data gambar dari base64
    image = Image.open(io.BytesIO(base64.b64decode(image_data)))
    
    width, height = image.size
    left = 200  # Jarak dari kiri
    upper = 100  # Jarak dari atas
    right = width - 250  # Jarak dari kanan (lebar asli dikurangi 100 piksel)
    lower = height - 90  # Jarak dari bawah (tinggi asli dikurangi 100 piksel)

    # Melakukan cropping dan resize
    cropped_image = image.crop((left, upper, right, lower))
    resized = cropped_image.resize((32, 32))
    resized = resized.convert('RGB')

    # Mendapatkan numpy array dari gambar
    resized_np = np.array(resized)  
    image_array = np.expand_dims(resized_np, axis=0)
    preprocessed_image = image_array / 255.0
            
    # Lakukan prediksi dengan model
    prediction = model.predict(preprocessed_image)
    index = np.argmax(prediction)
    label = class_labels[index] 

    probabilities = tf.nn.softmax(prediction)
    confidence = np.max(probabilities)
    confidence = float(confidence)
    confidence = confidence * 1000
    # confidence = '{:.2%}'.format(np.max(prediction * 100))

    result_text = ""
    if confidence < 14:
        result_text = "Tulis silabel dengan jelas"

    # Konversi gambar ke data URL
    buffered_resized = io.BytesIO()
    resized.save(buffered_resized, format="PNG")
    resized_data_uri = "data:image/png;base64," + base64.b64encode(buffered_resized.getvalue()).decode()

    # Kembalikan data URI gambar dan hasil prediksi sebagai respons
    return jsonify({
        'resized_data_uri': resized_data_uri, 
        'predicted_class': label,
        'res' : result_text
    })


if __name__ == '__main__':
    app.run(debug=True)
