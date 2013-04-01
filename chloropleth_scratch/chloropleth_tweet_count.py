################################################################################
## chloropleth_tweet_count.py
##
## Brad Taylor, March 2013
##
## Count tweets for each state.
## Use to make a cholorpleth, coloring states by # of tweets
## Eventually, could use state population data to normalize to tweets/person
##
## Output: A fills dict and a data dict for plugging into datamaps chloropleth example
##
## File names and fields are being hard-coded, and CSV structure is assumed.
##
################################################################################

# CSV and JSON libraries
import csv
import json

with open('tweets2.csv', 'rb') as fcsv:
    with open('states_JSON.json', 'wb') as fjson:
        # intialize output list
        stateData = {}
        
        # instantiate csv reader object
        reader = csv.reader(fcsv)

        # Skip the header row
        reader.next()
        
        # count the tweets, pack it into a dict
        for line in reader:
            state = line[3]
            if state not in stateData:
                stateData[state] = {'tweets': 1}
            else:
                stateData[state]['tweets'] +=1

        # append the fill keys to the state
        for state in stateData:
            stateData[state]['fillKey'] = state
            
        json.dump(stateData, fjson,indent=4,separators=(',',': '))
