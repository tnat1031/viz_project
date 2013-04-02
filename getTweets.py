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
                     'minute', 'text', 'hashtags', 'search_term', 'id']
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
                            [lat, long] = json.loads(re.sub("'", '"', re.sub('u', '', tweet.geo)))['coordinates']
                            new_row += [str(lat), str(long), tweet.author, str(d.year), d.month, d.day, d.hour, d.minute,
                                        encoded_text, '|'.join(hashtags(tweet.text)), s, id]
                            table.append(new_row)
                        except UnicodeEncodeError:
                            print tweet.text
                            continue
        except (HTTP500InternalServerError, HTTPError) as e:
            continue



    table.save(csv_output, headers=True)
    f = open(json_output, 'w')
    # would like to do something like this:
    #j = table.json.replace('\r', '\\r').replace('\n', '\\n')
    #print j[491700:491705]
    d = {'tweets' : table.json}
    json.dump(d, f, indent=4)
    f.close()

    # but having problems converting directly from Datasheet object to json
    # So, will write to file, read back in, then convert to json
    #j = Datasheet.load(csv_output, headers=True)
    #json.dump(j.json, json_output, indent=4)
    #f.close()



if __name__ == '__main__':
    # get arguments
    parser = argparse.ArgumentParser(description='get tweets within a set of locations\n')
    #parser.add_argument('-location_csv', type=str, default='/Users/tnatoli/github/viz_project/US_locations.csv')
    parser.add_argument('-csv_output', type=str, default='/Users/tnatoli/github/viz_project/tweets.csv')
    parser.add_argument('-json_output', type=str,default='/Users/tnatoli/github/viz_project/tweets.json')

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
