################################################################################
## tweets_csv_to_json.py
##
## Brad Taylor, March 2013
##
## Quick script to convert CSV data into JSON format,
## Each data point becomes it's own object entry
## This is the format expected to turn individual tweents into data bubbles
##
## File names and fields are being hard-coded, and CSV structure is assumed.
##
## NOT a general converter
################################################################################

# CSV and JSON libraries
import csv
import json

with open('tweets2.csv', 'rb') as fcsv:
    with open('tweets_JSON.json', 'wb') as fjson:
        # intialize output list
        entries = []
        
        # instantiate csv reader object
        reader = csv.reader(fcsv)

        # Skip the header row
        reader.next()
        
        # grab the data, pack it into a dict
        # TODO- add date info; skipping now for simplicity
        # TODO- hashtags?
        for line in reader:
            entry = {'radius':2, 'city': line[0],'fillKey': "USA",'state': line[3],'longitude': float(line[5]),'latitude': float(line[8]),'author': line[9],'text': line[15],'searchTerm': line[17],'tweetID': float(line[18])}
            entries.append(entry)

        data = {'mydata': entries}
        # pack the output fields into a dictionary
        #data = {entries}
        print entries[1:10]
        json.dump(data, fjson,indent=4,separators=(',',': '))
