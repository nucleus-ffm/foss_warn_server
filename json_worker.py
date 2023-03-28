import requests
import json
import pickle

url_and_etags = {
    "mowas": ["https://warnung.bund.de/bbk.mowas/gefahrendurchsagen.json", ""], # URL, last Etag
    "biwapp": ["https://warnung.bund.de/bbk.biwapp/warnmeldungen.json", ""],
    "katwarn": ["https://warnung.bund.de/bbk.biwapp/warnmeldungen.json", ""],
    "dwd": ["https://warnung.bund.de/bbk.dwd/unwetter.json", ""],
    "lhp": ["https://warnung.bund.de/bbk.lhp/hochwassermeldungen.json", ""],
    # "alertSwiss" : ["https://www.alert.swiss/content/alertswiss-internet/en/home/_jcr_content/polyalert.alertswiss_alerts.actual.json", ""],
    }

def sendNotification(headline, geocode):
    print("send notification for: {}: {}".format(geocode, headline))
    url = "https://ntfy.adminforge.de/FOSSWARN_{}".format(geocode) #
    print(url)
    requests.post(url, data=headline.encode(encoding='utf-8'))

def loadJson(place, url, etag):
    resp = requests.get(url=url, headers={'If-None-Match': ''}) # etag
    # print("Statuscode: {}".format(resp.status_code) )
    # check if request was sucessful
    if (resp.status_code == 200):
        print(url + " sucess")

        try:
            print("etag is: " + resp.headers["etag"] + " saved etag was: " + etag)
            url_and_etags[place][1] = resp.headers["etag"]
        except:
            print("there is no etag")

        jsonData = json.loads(resp.text)

        for alerts in jsonData:
            headline = alerts['info'][0]['headline']
            for places in alerts['info'][0]['area'][0]['geocode']:
                sendNotification(headline, places['value'])
    elif(resp.status_code == 304):
        print("Status 304 - Nothing changed for: {}".format(place))

def saveUrlAndEtags():
    with open('etags.pkl', 'wb') as f:
        pickle.dump(url_and_etags, f)

def loadUrlAndEtags():
    global url_and_etags
    try:
        with open('etags.pkl', 'rb') as f:
            url_and_etags = pickle.load(f)
    except:
        print("there is no etags file..")

loadUrlAndEtags()
for place in url_and_etags:
    print("calling {}...".format(place))
    loadJson(place, url_and_etags[place][0], url_and_etags[place][1])
saveUrlAndEtags()
