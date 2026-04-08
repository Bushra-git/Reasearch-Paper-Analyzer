import requests

res = requests.post("http://127.0.0.1:5000/predict", json={
    "text": "This paper proposes a machine learning model for prediction"
})

print(res.json())