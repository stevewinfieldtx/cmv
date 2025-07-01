import sys
import os
import json
import requests

def get_suno_tags_from_grok(target, kind='artist'):
    api_key = os.getenv("GROK_API_KEY")
    if not api_key:
        raise Exception("Missing GROK_API_KEY")
    prompt = (
        f"Given the {kind} [{target}], generate a comma-separated list of Suno-compatible tag words "
        f"that best represent the style, genre, mood, and production traits. "
        f"Do NOT include the artist or song name."
    )
    resp = requests.post(
        "https://api.grok.com/v1/chat",
        json={"prompt": prompt},
        headers={"Authorization": f"Bearer {api_key}"}
    )
    if resp.ok:
        text = resp.json().get("best_completion", "")
        return [tag.strip() for tag in text.split(",") if tag.strip()]
    else:
        raise Exception("Grok API error: " + resp.text)

def generate_music(prompt, output_path):
    # Replace this with actual API call to your Music API (e.g., Suno)
    # Here's a placeholder that writes dummy audio file:
    with open(output_path, 'wb') as f:
        f.write(b"FAKEAUDIO")
    return output_path

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 music_creator.py job_config.json")
        sys.exit(1)

    config_path = sys.argv[1]
    with open(config_path, 'r') as f:
        config = json.load(f)

    # Compose prompt using Grok for tags
    if config.get("musicStyle") == "similar":
        reference = config.get("artistReference") or config.get("songReference")
        kind = "artist" if config.get("artistReference") else "song"
        suno_tags = get_suno_tags_from_grok(reference, kind=kind)
        prompt = ", ".join(suno_tags)
    elif config.get("musicStyle") == "unique" and config.get("uniqueVision"):
        suno_tags = get_suno_tags_from_grok(config["uniqueVision"], kind="vision")
        prompt = ", ".join(suno_tags)
    else:
        prompt = "pop, upbeat"  # Fallback

    # Here you’d call your real music API
    output_audio = "/tmp/generated_audio.mp3"
    generate_music(prompt, output_audio)

    print(f"GENERATED_AUDIO_PATH: {output_audio}")

if __name__ == '__main__':
    main()
