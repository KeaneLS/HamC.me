import pveagle
from pvrecorder import PvRecorder

DEFAULT_DEVICE_INDEX = -1
access_key = "{YOUR_ACCESS_KEY}";

# Step 1: Enrollment
try:
    eagle_profiler = pveagle.create_profiler(access_key=access_key)
except pveagle.EagleError as e:
    pass

enroll_recorder = PvRecorder(
    device_index=DEFAULT_DEVICE_INDEX,
    frame_length=eagle_profiler.min_enroll_samples)

enroll_recorder.start()

enroll_percentage = 0.0
while enroll_percentage < 100.0:
    audio_frame = enroll_recorder.read()
    enroll_percentage, feedback = eagle_profiler.enroll(audio_frame)

enroll_recorder.stop()

speaker_profile = eagle_profiler.export()

enroll_recorder.delete()
eagle_profiler.delete()

# Step 2: Recognition
try:
    eagle = pveagle.create_recognizer(
        access_key=access_key,
        speaker_pofiles=[speaker_profile])
except pveagle.EagleError as e:
    pass

recognizer_recorder = PvRecorder(
    device_index=DEFAULT_DEVICE_INDEX,
    frame_length=eagle.frame_length)

recognizer_recorder.start()

while True:
    audio_frame = recorder.read()
    scores = eagle.process(audio_frame)
    print(scores)

recognizer_recorder.stop()

recognizer_recorder.delete()
eagle.delete()