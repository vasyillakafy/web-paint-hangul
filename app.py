from flask import Flask, render_template, request, jsonify
from keras.models import load_model
from PIL import Image
import io
import base64
import numpy as np


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
    return render_template('tutorial.html')

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
    left = 150  # Jarak dari kiri
    upper = 140  # Jarak dari atas
    right = width - 200  # Jarak dari kanan (lebar asli dikurangi 100 piksel)
    lower = height - 40  # Jarak dari bawah (tinggi asli dikurangi 100 piksel)

    # Melakukan cropping dan resize
    cropped_image = image.crop((left, upper, right, lower))
    resized = cropped_image.resize((32, 32))

    # Konversi gambar ke mode RGB sebelum mendapatkan numpy array
    resized_rgb = resized.convert('RGB')
    # Mendapatkan numpy array dari gambar
    resized_rgb_np = np.array(resized_rgb)

    # # Dilasi
    # # gray = cv2.cvtColor(resized_rgb_np, cv2.COLOR_BGR2GRAY)
    # kernel = np.ones((2, 2), np.uint8)
    # morph_dilate = cv2.dilate(resized_rgb_np, kernel, iterations=1)

    # Menambahkan dimensi channel
    resized_channel = np.expand_dims(resized_rgb_np, axis=-1)
    # Menambahkan dimensi batch size
    resized_batch = np.expand_dims(resized_channel, axis=0)
        
    # Contoh praproses: normalisasi
    preprocessed_image = resized_batch / 255.0
            
    # Lakukan prediksi dengan model
    prediction = model.predict(preprocessed_image)
        
    # Dapatkan hasil prediksi (misalnya, kelas dengan nilai tertinggi)
    predicted_class_index = np.argmax(prediction)
    predicted_class_label = class_labels[predicted_class_index] 

    # # Konversi kembali ke gambar PIL
    # dilated_pil = Image.fromarray(morph_dilate)

    # Konversi gambar ke data URL
    buffered_resized = io.BytesIO()
    resized.save(buffered_resized, format="PNG")
    resized_data_uri = "data:image/png;base64," + base64.b64encode(buffered_resized.getvalue()).decode()

    # buffered_dilated = io.BytesIO()
    # dilated_pil.save(buffered_dilated, format="PNG")
    # dilated_data_uri = "data:image/png;base64," + base64.b64encode(buffered_dilated.getvalue()).decode()
    
    # Kembalikan data URI gambar dan hasil prediksi sebagai respons
    return jsonify({
        'resized_data_uri': resized_data_uri, 
        # 'dilated_data_uri': dilated_data_uri,
        'predicted_class': predicted_class_label  # Konversi ke integer untuk memastikan
    })


if __name__ == '__main__':
    app.run(debug=True)
