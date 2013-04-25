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

search_terms = ['all_tweets','fuck','shit', 'bitch', 'ass', 'asshole','dick', 'cunt', 
						'nigger', 'nigga', 'faggot',  'spic', 
						'slut', 'whore','fucker', 'mother fucker',
						'kill', 'beat', 'rape', 'fight', 'stab', 'shoot',
						'twitter', 'tweet'];

with open('tweets_rev_geo.csv', 'rb') as tcsv:

    tweets = {}
    tweetReader = csv.reader(tcsv)
    tweetReader.next()
    
    for line in tweetReader:
        # Not interested in tweets from outside US
        country = line[13]
        if country != 'US': continue

        searchTerm = line[10]
	date = line[4]+"_"+line[5]+"_"+line[3]
        state = line[11]
        countyName = line[12].lower()
        countyTag = countyName+"_"+state

        if countyTag not in tweets:
            tweets[countyTag] = {}
            for term in search_terms:
                tweets[countyTag][term] = 0
            tweets[countyTag][searchTerm] = 1
            tweets[countyTag]['all_tweets'] = 1
        else:
            tweets[countyTag][searchTerm] += 1
            tweets[countyTag]['all_tweets'] += 1     

with open('social_final.csv', 'rb') as sfcsv:
    with open('social_tweet_data.csv', 'wb') as ocsv:
        
        # instantiate csv reader/writer objects
        reader = csv.reader(sfcsv)
        writer = csv.writer(ocsv)

        # Skip the header row
        header = reader.next()
        for term in search_terms: header.append(term)
        writer.writerow(header)
        
        # count the tweets, pack it into a dict
        for line in reader:
            countyTag = line[2]+"_"+line[4]
            population = float(line[5])
            if countyTag in tweets:
                for term in search_terms:
                    line.append(float(tweets[countyTag][term])/population)
            else:
                for term in search_terms:
                    line.append(0)
            writer.writerow(line)


        
##            searchTerm = line[10]
##	    date = line[4]+"_"+line[5]+"_"+line[3]
##            state = line[11]
##            countyName = line[12].lower()
##            countyTag = countyName+"_"+state
##            # skip non-US counties
##            if countyTag not in counties:
##                #skipped+=1
##                continue
##            
##            if date not in counties[countyTag]["data"]:
##                counties[countyTag]["data"][date] = {}
##            if searchTerm not in counties[countyTag]["data"][date]:
##                counties[countyTag]["data"][date][searchTerm] = 1
##            if 'all_terms' not in counties[countyTag]["data"][date]:
##                counties[countyTag]["data"][date]['all_terms'] = 1
##            else:
##                counties[countyTag]["data"][date][searchTerm] += 1
##                counties[countyTag]["data"][date]['all_terms'] += 1
##
##
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
