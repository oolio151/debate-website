import firebase_admin
import os 
from firebase_admin import credentials, db
import json
from  flask import *

#generates the database file from firebase, which the js will then use to generate html
def generateDatabaseFile():
    cred = credentials.Certificate(os.getcwd()+"/debateclub2-fd753-firebase-adminsdk-qui5u-44dddc9b04.json")

    default_app = firebase_admin.initialize_app(cred, {
        'databaseURL' : "https://debateclub2-fd753-default-rtdb.firebaseio.com/"
    })

    ref = db.reference("/")
    data = ref.get()

    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


generateDatabaseFile()
#FLASK
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calendar')
def calendar():
    return render_template('calendar.html')

@app.route('/leaders')
def leaders():
    return render_template('leaders.html')

@app.route('/pfinfo')
def pfinfo():
    return render_template('pfinfo.html')

@app.route('/speech')
def speech():
    return render_template('speech.html')

@app.route('/ldinfo')
def ldinfo():
    return render_template('ldinfo.html')

@app.route('/congress')
def congress():
    return render_template('congress.html')

@app.route('/clubinfo')
def clubinfo():
    return render_template('clubinfo')

@app.route('/json_data')
def get_json_data():
    # Read the JSON data from the file
    with open('data.json', 'r') as file:
        json_data = json.load(file)
    return jsonify(json_data)

if __name__ == '__main__':
    app.run(debug=True)