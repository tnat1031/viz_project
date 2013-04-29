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

search_terms = ['all_terms','fuck','shit', 'bitch', 'ass', 'asshole','dick', 'cunt', 
						'nigger', 'nigga', 'faggot',  'spic', 
						'slut', 'whore','fucker', 'mother fucker',
						'kill', 'beat', 'rape', 'fight', 'stab', 'shoot',
						'twitter', 'tweet'];

# grab all of the counties for which we have geoIDs from census data
# grab population too, for pop-correcting tweet counts
with open('../data/social_final.csv', 'rb') as sfcsv:
    counties = {}
    geoReader = csv.reader(sfcsv)
    geoReader.next()
    
    for line in geoReader:
        countyTag = line[2]+"_"+line[4]
        counties[countyTag] = {}
        counties[countyTag]["countyName"] = line[2]
        counties[countyTag]["state"] = line[4]
        counties[countyTag]["geoid"] = line[0]
        counties[countyTag]["population"] = line[5]
        counties[countyTag]["data"] = {}
        
# loop through our reverse geocoded tweets and aggregate them by county/date/searchterm
with open('../data/tweets_rev_geo.csv', 'rb') as tcsv:
    with open('../data/chloropleth_data.csv', 'wb') as ocsv:
        # keep track of the dates we've seen
        dates = []
        jdate = []
        
        # instantiate csv reader/writer objects
        reader = csv.reader(tcsv)
        writer = csv.writer(ocsv)

        # Skip the header row of reader csv
        reader.next()

        #skipped = 0
        
        # count the tweets, pack it into a dict
        for line in reader:
            searchTerm = line[10]
	    date = line[4]+"_"+line[5]+"_"+line[3]
            jsonDate = line[3]+"-"+line[4]+"-"+line[5]

            if date not in dates:
                dates.append(date)
                thisdate= {}
                thisdate["date"] = jsonDate
                jdate.append(thisdate)
                
            state = line[11]
            countyName = line[12].lower()
            countyTag = countyName+"_"+state
            # skip non-US counties
            if countyTag not in counties:
                #skipped+=1
                continue
            
            if date not in counties[countyTag]["data"]:
                counties[countyTag]["data"][date] = {}
            if 'all_dates' not in counties[countyTag]["data"]:
                counties[countyTag]["data"]['all_dates'] = {}
            if searchTerm not in counties[countyTag]["data"][date]:
                counties[countyTag]["data"][date][searchTerm] = 1
            if searchTerm not in counties[countyTag]["data"]['all_dates']:
                counties[countyTag]["data"]['all_dates'][searchTerm] = 1
            if 'all_terms' not in counties[countyTag]["data"][date]:
                counties[countyTag]["data"][date]['all_terms'] = 1
            if 'all_terms' not in counties[countyTag]["data"]['all_dates']:
                counties[countyTag]["data"]['all_dates']['all_terms'] = 1
            else:
                counties[countyTag]["data"][date][searchTerm] += 1
                counties[countyTag]["data"][date]['all_terms'] += 1
                counties[countyTag]["data"]['all_dates'][searchTerm] += 1
                counties[countyTag]["data"]['all_dates']['all_terms'] += 1
        dates.append('all_dates')
        dates.sort()

        # write a header for our output file
        header = ['geoid','county','state','population','date']
        for term in search_terms: header.append(term)
        writer.writerow(header)
        
        # write out data into csv. Good lord this is ugly
        # don't want to write to json bc it will make filtering harder later.
        # Too many axes: county, date, term
        for countyTag in counties:
            for date in dates:
                # load county information
                outline = [ counties[countyTag]["geoid"] ]
                outline.append(counties[countyTag]["countyName"])
                outline.append(counties[countyTag]["state"])
                outline.append(counties[countyTag]["population"])
                outline.append(date)
                if date in counties[countyTag]["data"]:
                    for term in search_terms:
                        if term in counties[countyTag]["data"][date]:
                            outline.append(float(counties[countyTag]["data"][date][term]) / float(counties[countyTag]["population"]) )
                        else:
                            outline.append(0)
                else:
                    for term in search_terms:
                        outline.append(0)
                writer.writerow(outline)

with open('../data/chloropleth_dates.json', 'wb') as ojson:
    jdate.sort
    json.dump(jdate, ojson,indent=4,separators=(',',': '))
        
                            
##        for i in counties:
##            for j in counties[i]:
##                print counties[i][j]
        #print(counties)


##        # append the fill keys to the state
##        for state in stateData:
##            stateData[state]['fillKey'] = state

        # calculate the per-capita tweets (tweets/population)
        # throw away any non-US-States
##        finalData = {}
##        for state in stateData:
##            if state in statePops:
##                finalData[state] = {}
##                finalData[state]['tweets'] = stateData[state]['tweets']
##                finalData[state]['perCapita']= (stateData[state]['tweets'] / statePops[state])
##                finalData[state]['fillKey'] = state
##        json.dump(finalData, fjson,indent=4,separators=(',',': '))
