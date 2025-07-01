from flask import Flask, render_template

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/healthz')
def healthz():
    return "ok", 200

if __name__ == '__main__':
    app.run()
