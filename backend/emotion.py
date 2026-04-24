from deepface import DeepFace
import sys
import json

img_path = sys.argv[1]

result = DeepFace.analyze(img_path, actions=['emotion'])

emotions = result[0]['emotion']

# pick best emotion manually
dominant = max(emotions, key=emotions.get)

print(dominant)