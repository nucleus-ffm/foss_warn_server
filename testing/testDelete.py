# test to delete a client

import requests

url = 'http://localhost:3000/remove'
myobj = {'distributor_url': 'https://ntfy.adminforge.de/FOSSWARN_kjsdfoesjdf', 'reason': "app deinstalled"}

x = requests.post(url, json = myobj)
print(x.text)
