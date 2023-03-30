# test to update a client

import requests

url = 'http://localhost:3000/update'
myobj = {'distributor_url': 'https://ntfy.adminforge.de/FOSSWARN_kjsdfoesjdf', 'new_geocode': ['1234', '5678'], 'remove_geocode': ['053660000000', '053660000000']}

x = requests.post(url, json = myobj)
print(x.text)
