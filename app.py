import os
import json
import subprocess
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create', methods=['POST'])
def create():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    job_config_path = '/tmp/job_config.json'
    with open(job_config_path, 'w') as f:
        json.dump(data, f)

    # Call music_creator.py (handles tags & music gen)
    music_cmd = ['python3', 'music_creator.py', job_config_path]
    music_proc = subprocess.run(music_cmd, capture_output=True, text=True)
    print(music_proc.stdout)
    if music_proc.returncode != 0:
        return jsonify({'error': 'Music generation failed', 'details': music_proc.stderr}), 500

    audio_path = None
    for line in music_proc.stdout.splitlines():
        if line.startswith("GENERATED_AUDIO_PATH:"):
            audio_path = line.split(":", 1)[1].strip()
    if not audio_path or not os.path.exists(audio_path):
        return jsonify({'error': 'Could not get audio file path'}), 500

    # Call video_creator.py (handles beat analysis, prompt gen, Runware, assembly)
    video_cmd = ['python3', 'video_creator.py', audio_path, job_config_path]
    video_proc = subprocess.run(video_cmd, capture_output=True, text=True)
    print(video_proc.stdout)
    if video_proc.returncode != 0:
        return jsonify({'error': 'Video generation failed', 'details': video_proc.stderr}), 500

    video_url = None
    for line in video_proc.stdout.splitlines():
        if line.startswith("FINAL_VIDEO_URL:"):
            video_url = line.split(":", 1)[1].strip()
    if not video_url:
        return jsonify({'error': 'Could not get video URL'}), 500

    return jsonify({'video_url': video_url})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
