import pvporcupine
from pvrecorder import PvRecorder

keywords = pvporcupine.KEYWORDS
for x in keywords:
    print(x)
print("\n\n")

access_key = "s7Q7oAC1lr8T7koB99nytv1X+nbBZ5QFPpPXZx+VAcyJ+nz465TwOg=="

# keyword_paths = ['./Paul-Ward-Sucks_en_windows_v3_0_0.ppn']
# keywords = ['Paul-Ward-Sucks']
#
keyword_paths = ['./Paul-Ward-On-Top_en_windows_v3_0_0.ppn']
keywords = ['Paul-Ward-On-Top']

porcupine = pvporcupine.create(
    access_key=access_key,
    keyword_paths=keyword_paths
)

# porcupine = pvporcupine.create(
#     access_key=access_key,
#     keywords=keywords
# )

recorder = PvRecorder(device_index=-1, frame_length=porcupine.frame_length)

try:
    recorder.start()

    while True:
        pcm = recorder.read()
        keyword_index = porcupine.process(pcm)
        if keyword_index >= 0:
            print(f"================\nDetected {list(keywords)[keyword_index]}\n================")
            if list(keywords)[keyword_index] == "Paul-Ward-Sucks":
                print("$200 has been removed from your bank account")
            if list(keywords)[keyword_index] == "Paul-Ward-On-Top":
                print("$200 has been deposited to your bank account!!! You are the most correct person!!!")

except KeyboardInterrupt:
    print("Stopping...")
finally:
    recorder.stop()
    porcupine.delete()
    recorder.delete()