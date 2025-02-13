import datetime
import speech_recognition as sr
from pydub import AudioSegment
from io import BytesIO
from s3Upload import upload_file_to_s3
import requests

# List of words to detect
# swears = ["fuck", "shit", "asshole", "dick", "hell"]

# Stats:
# Keane 3/4
# Fletcher 9/10
# Kevin 4/4
# Detection Stats:
# 6/10

# He spoke great words again.
# Avoid saying plain things today.
# Her middle was tone.
# That joke was pig nonsense.
# His attitude seemed ant lately.

# Duration of the audio buffer (in milliseconds)
BUFFER_DURATION = 5000  # 5 seconds

def save_audio(audio_segment, filename):
    """Save the audio segment to a file."""
    audio_segment.export(filename, format="wav")
    print(f"Saved audio to {filename}")

def live_speech_to_text():
    # Create a recognizer object
    recognizer = sr.Recognizer()

    # Initialize an empty audio buffer
    audio_buffer = AudioSegment.empty()

    mic_list = sr.Microphone.list_microphone_names()
    # print("Available microphones:")
    # for index, name in enumerate(mic_list):
    #     print(f"{index}: {name}")

    response = requests.post('https://8c34-129-97-124-166.ngrok-free.app/fetch-swears')

    if response.status_code == 200:
        data = response.json()
        swears = data.get('swears', [])
    else:
        print(f"Response: {response.text}")
        return None
    try:
        with sr.Microphone(sample_rate=48000, chunk_size=4096, device_index=1) as source:
            print("Calibrating microphone... Please wait.")
            recognizer.energy_threshold = 300  # Adjust for noise sensitivity
            recognizer.adjust_for_ambient_noise(source, duration=3)
            print("Calibration complete. Listening for speech...")

            while True:
                try:
                    audio = recognizer.listen(source)

                    text = recognizer.recognize_google(audio)
                    print(f"Detected Speech: {text}")

                    words = text.split()

                    if any(word.lower() in swears for word in words):
                        detected_swear = next(word for word in words if word.lower() in swears)
                        print(f"Swear detected: {detected_swear}")

                        # Post the detected swear to the webhook
                        fileName = f"swear_context_{datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.wav"
                        webhook_url = "http://localhost:5000/webhook"  # Replace with your actual webhook URL
                        payload = {
                            "swear": True,
                            "word": detected_swear,
                            "amazonS3Link": fileName
                        }

                        try:
                            response = requests.post(webhook_url, json=payload)
                            if response.status_code == 200:
                                print("Successfully posted to webhook:", response.json())
                            else:
                                print(
                                    f"Failed to post to webhook. Status code: {response.status_code}, Response: {response.text}")
                        except Exception as e:
                            print(f"Error occurred while posting to webhook: {e}")

                        before_audio = audio_buffer[-BUFFER_DURATION:]

                        if len(before_audio) < BUFFER_DURATION:
                            missing_duration = BUFFER_DURATION - len(before_audio)
                            before_audio = AudioSegment.silent(duration=missing_duration) + before_audio

                        print("Recording next 10 seconds...")
                        next_audio = recognizer.record(source, duration=10)
                        next_audio_segment = AudioSegment.from_file(BytesIO(next_audio.get_wav_data()), format="wav")


                        if len(next_audio_segment) < BUFFER_DURATION:
                            missing_duration = BUFFER_DURATION - len(next_audio_segment)
                            next_audio_segment += AudioSegment.silent(duration=missing_duration)
                        after_audio = next_audio_segment
                        full_audio = before_audio + after_audio
                        save_audio(full_audio, fileName)

                        upload_file_to_s3(fileName)

                    current_audio = AudioSegment.from_file(BytesIO(audio.get_wav_data()), format="wav")

                    if len(current_audio) < BUFFER_DURATION:
                        missing_duration = BUFFER_DURATION - len(current_audio)
                        current_audio += AudioSegment.silent(duration=missing_duration)

                    audio_buffer += current_audio

                    if len(audio_buffer) > BUFFER_DURATION:
                        audio_buffer = audio_buffer[-BUFFER_DURATION:]
                except sr.UnknownValueError:
                    print("Sorry, could not understand the audio.")
                except sr.RequestError as e:
                    print(f"Could not request results; {e}")
                except KeyboardInterrupt:
                    print("\nExiting program. Goodbye!")
                    break
    except sr.WaitTimeoutError:
        print("Listening timed out while waiting for phrase to start")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# Run the live speech-to-text function
if __name__ == "__main__":
    live_speech_to_text()