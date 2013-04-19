#! /usr/bin/env python

'''
A script to collect Tweets from within a group of specified geo-locations that
contain words or phrases from a given set.

Probably want to output as a json object so will me more easily loaded
into a web viz.

Maybe also a csv since that will be more easily analyzed in something like R.

json output will be something like:

{
    {"location" : {"lat" : 42, "long" : -71, "city" : "Boston",
                     "zip" : "02214",
                    "state" : "MA" },
    "tweets" : [
               [ "date" : "March 17, 2013",
                 "time" : "15:00",
                 "tweet" : "some text from a tweet"]
            ]
    }
    ...
}



CSCI E-64
Project II
Ted Natoli & Brad Taylor
'''

# pattern_copy is our modified version of pattern that allows us to return lat, long with tweets

from pattern_copy.web import Twitter, hashtags, HTTP500InternalServerError, HTTPError
from pattern_copy.db import Datasheet, STRING, DATE, date
import sys
import argparse
import json
import re
import s3_utils
import os
import urllib

GEOCODE_BASE_URL = 'http://maps.googleapis.com/maps/api/geocode/json'
RESULT_FORMAT = u'short_name'
DESIRED_INFO = ['administrative_area_level_1', 'administrative_area_level_2', 'country']

def reverse_geocode(latlng,sensor='false', **geo_args):
    geo_args.update({
        'latlng': latlng,
        'sensor': sensor  
    })

    url = GEOCODE_BASE_URL + '?' + urllib.urlencode(geo_args)
    result = json.load(urllib.urlopen(url))

    # parse the url result and pull out JUST the element we need (ie state)
    if result == {u'status': u'OVER_QUERY_LIMIT', u'results': []}:
        return result['status']
    try:
        address_components = result['results'][0]['address_components']
        geonames = filter(lambda x: len(set(x['types']).intersection(DESIRED_INFO)), address_components)
        
        # Return the result in the desired format (ie long_name, short_name, etc.)
        results = { 'country' : '',
                    'state' : '',
                    'county' : ''}
        for g in geonames:
            if 'country' in g['types']:
                results['country'] = g[RESULT_FORMAT]
            elif 'administrative_area_level_1' in g['types']:
                results['state'] = g[RESULT_FORMAT]
            elif 'administrative_area_level_2' in g['types']:
                results['county'] = g[RESULT_FORMAT]
        return results
    except: return {}

def getTweetsGeo(search_terms_list, csv_output, json_output,
                 radius='10km', cached=False, count=100):
    '''
    use pattern's search feature to get tweets within the given search area
    :param search_terms_list:
    :param csv_output:
    :param json_output:
    :param radius:
    :param cached:
    :param count:
    '''

    tweet_headers = ['lat', 'long', 'author', 'year', 'month', 'day', 'hour',
                     'minute', 'text', 'hashtags', 'search_term', 'state', 'county', 'country', 'id']
    #loc_headers = locations_list_of_dicts[0].keys()

    try:
        table = Datasheet.load(csv_output, headers=True)
        seen_tweet_ids = dict.fromkeys(table.columns[len(table.rows[0]) - 1], True)
       # print seen_tweet_ids
    except:
        tweet_types = [(x, 'string') for x in tweet_headers]
        #loc_types = [(x, 'string') for x in loc_headers]
        headers = tweet_types # + loc_types
        table = Datasheet(fields=headers)
        seen_tweet_ids = {}

    engine = Twitter(language='en')


    for s in search_terms_list:
        try:
            for tweet in engine.search(s, cached=cached, count=count):
                id = str(hash(tweet.author + tweet.text + s))
                if len(table) == 0 or id not in seen_tweet_ids:
                    # does it have a geo code?
                    if tweet.geo:
                        # this is a new tweet, store it
                        # does it encode properly?
                        try:
                            encoded_text = unicode(tweet.text)
                            new_row = []
                            d = date(tweet.date)
                            [lat, lng] = json.loads(re.sub("'", '"', re.sub('u', '', tweet.geo)))['coordinates']
                            latlng = str(lat) + ',' + str(lng)
                            results = reverse_geocode(latlng)
                            if results:
                                new_row += [str(lat), str(lng), tweet.author, str(d.year), d.month, d.day, d.hour, d.minute,
                                        encoded_text, '|'.join(hashtags(tweet.text)), s, results['state'], results['county'],
                                        results['country'], id]
                                table.append(new_row)
                        except UnicodeEncodeError:
                            print tweet.text
                            continue
        except (HTTP500InternalServerError, HTTPError) as e:
            continue



    table.save(csv_output, headers=True)
    #f = open(json_output, 'w')
    # would like to do something like this:
    #j = table.json.replace('\r', '\\r').replace('\n', '\\n')
    #print j[491700:491705]
    #d = {'tweets' : table.json}
    #json.dump(d, f, indent=4)
    #f.close()

    # but having problems converting directly from Datasheet object to json
    # So, will write to file, read back in, then convert to json
    #j = Datasheet.load(csv_output, headers=True)
    #json.dump(j.json, json_output, indent=4)
    #f.close()



if __name__ == '__main__':
    # get arguments
    parser = argparse.ArgumentParser(description='get tweets within a set of locations\n')
    #parser.add_argument('-location_csv', type=str, default='/Users/tnatoli/github/viz_project/US_locations.csv')
    parser.add_argument('-csv_output', type=str, default='/Users/tnatoli/github/viz_project/website/data/tweets.csv')
    parser.add_argument('-json_output', type=str,default='/Users/tnatoli/github/viz_project/website/data/tweets.json')
    parser.add_argument('-bucket', type=str, default='tn_bucket')
    parser.add_argument('-aws_cred_file', type=str, default='/xchip/cogs/projects/aws/creds.txt')

    args = parser.parse_args(sys.argv[1:])

    # a dictionary of locations with lat, long attributes
    #locations = json.loads(Datasheet.load(args.location_csv, headers=True).json)

    search_terms = [
        # traditional swears
        'fuck', 'shit', 'bitch', 'ass', 'asshole',

        # derogatory terms
        'nigger', 'nigga', 'faggot', 'cunt', 'slut', 'whore', 'spic', 'dick', 'fucker', 'mother fucker',

        # violent terms
        'kill', 'beat', 'rape', 'fight', 'stab', 'shoot',

        # control words
        'twitter', 'tweet'
        ]

    getTweetsGeo(search_terms, args.csv_output, args.json_output)

    # get AWS login credentials
    [aws_key_id, aws_secret_key] = s3_utils.getCredentials(args.aws_cred_file)

    # connect to amazon s3 and upload tweet data
    # assumes AWS environment variables are set
    s3_utils.pushToS3(args.csv_output, aws_key_id, aws_secret_key, args.bucket, name=os.path.basename(args.csv_output))
