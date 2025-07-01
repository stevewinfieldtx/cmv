import os
from flask import Flask, render_template

# This tells Flask to serve static files from /static, templates from /templates
app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    return render_template("index.html")

# Optional: add a simple health check endpoint
@app.route('/healthz')
def healthz():
    return 'ok', 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
