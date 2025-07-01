from flask import Flask
app = Flask(__name__, static_folder='static', template_folder='.')

@app.route('/')
def index():
    return 'Hello, Railway!'

@app.route('/healthz')
def healthz():
    return "ok", 200

if __name__ == '__main__':
    app.run()
