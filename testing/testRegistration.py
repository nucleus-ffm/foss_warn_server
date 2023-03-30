# test to register a client
import requests

url = 'http://localhost:3000/registration'
myobj = {'distributor_url': 'https://ntfy.adminforge.de/FOSSWARN_kjsdfoesjdf', 'geocode': '053660000000'}

x = requests.post(url, json = myobj)
print(x.text)
