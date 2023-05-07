# test to delete a client

import requests

url = 'http://localhost:3000/remove'
myobj = {'distributor_url': 'https://ntfy.sh/up6o056orkrOtf?up=1', 'reason': "app deinstalled"}

x = requests.post(url, json = myobj)
print(x.text)
