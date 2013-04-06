################################################################################
## chloropleth_tweet_count.py
##
## Brad Taylor, April 2013
##
## Updated 4/6/13
##
## Count tweets for each state.
## Divides by the state population to get a tweets/capita value
##
## Use to make a cholorpleth, coloring states by # of tweets / capita
##
## Output: A fills dict and a data dict for plugging into datamaps chloropleth
##
## File names and fields are being hard-coded, and CSV structure is assumed.
##
## Note- our twitter scraper picked up some tweets from outside the USA.
##       My reverse geocoder also failed on some lat/lng combinations (coded as "unknown")
##
## I throw these out!
################################################################################

# CSV and JSON libraries
import csv
import json

with open('state_populations.csv', 'rb') as sfcsv:
    statePops = {}
    popReader = csv.reader(sfcsv)
    popReader.next()
    for line in popReader:
        state = line[3]
        if state not in statePops:
                statePops[state] = float(line[4])
        else: print 'found a state twice? = '+state

with open('tweets_geocoded.csv', 'rb') as fcsv:
    with open('states_JSON.json', 'wb') as fjson:
        # intialize output list
        stateData = {}
        
        # instantiate csv reader object
        reader = csv.reader(fcsv)

        # Skip the header row
        reader.next()
        
        # count the tweets, pack it into a dict
        for line in reader:
            state = line[12]
            # skip tweets where geocoding failed, or for non-US-states
            #if len(state) > 2: continue
            if state not in stateData:
                stateData[state] = {'tweets': 1}
            else:
                stateData[state]['tweets'] +=1

        # append the fill keys to the state
        for state in stateData:
            stateData[state]['fillKey'] = state

        # calculate the per-capita tweets (tweets/population)
        # throw away any non-US-States
        finalData = {}
        for state in stateData:
            if state in statePops:
                finalData[state] = {}
                finalData[state]['perCapita']= (stateData[state]['tweets'] / statePops[state])
                finalData[state]['fillKey'] = state
        json.dump(finalData, fjson,indent=4,separators=(',',': '))
