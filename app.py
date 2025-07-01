from flask import Flask, render_template, request, jsonify

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/healthz')
def healthz():
    return "ok", 200

@app.route('/create', methods=['POST'])
def create():
    data = request.get_json()
    print("Received from frontend:", data)
    result = {
        "status": "success",
        "message": "Your video is being created!",
        "echo": data
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run()
