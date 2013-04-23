#! /usr/bin/env python

################################################################################
## reverse_geocode.py
##
## Brad Taylor, April 2013
##
## Script to reverse geocode tweets from our CSV data
##
## Queries google maps api. Requires key. Obtain here:
##      https://code.google.com/apis/console/
##
## See: https://developers.google.com/maps/documentation/geocoding/#ReverseGeocoding
##
## NOTE- limited to 2,500 queries/day. Do not use if #tweets goes beyond
##
## NOTE- TURNS OUT there is a secret limit of 10-15 queries/second. Introduced a sleep
##
## Parses response for an element of DESIRED_INFO (in our case, state ie 'NY')
##
## POSSIBLE BUG- really only set up to pull out ONE piece of desired info
##     Could set it up to return more, as list. But want to avoid excess
##      stuff in a function being called on 16K+ tweets
##
## Built from the following example scripts:
## https://developers.google.com/maps/documentation/webservices/
## http://gmaps-samples.googlecode.com/svn/trunk/geocoder/python/SimpleParser.py
## http://stackoverflow.com/questions/8395252/how-to-reverse-geocode-serverside-with-python-json-and-google-maps
##
## Update 4/6/2013-
## Script was giving a unicode error on author and text fields.
## I tried a number of options, including:
##      > unicode(line[2])  <-- line[2] is 'author' in input file
##      > line[2].encode('ascii', 'ignore')
##      > using the UnicodeWriter class
##
## ...nothing worked, so I just skipped those tweets.
##
################################################################################

# leverage the reverse_geocode function we are already using in getTweets.py
import getTweets
from pattern_copy.db import Datasheet
import argparse
import sys
import s3_utils
import os
import time
    
if __name__ == '__main__':
    # get args
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('-i', type=str, help='input csv',
                        default='/Users/tnatoli/github/viz_project/website/data/tweets.csv')
    parser.add_argument('-o', type=str, help='output csv',
                        default='/Users/tnatoli/github/viz_project/website/data/tweets_geocoded.csv')
    parser.add_argument('-bucket', type=str, default='tn_bucket')
    parser.add_argument('-aws_cred_file', type=str, default='/xchip/cogs/projects/aws/creds.txt')

    args = parser.parse_args(sys.argv[1:])

    input_csv = Datasheet.load(args.i, headers=True)
        
    try:
        output_csv = Datasheet.load(args.o, headers=True)
        seen_tweet_ids = dict.fromkeys(output_csv.columns[len(output_csv.rows[0]) - 1], True)
    except:
        new_headers = [(x, 'string') for x in ['state', 'county', 'country']]
        headers = input_csv.headers[:-1] + new_headers + [input_csv.headers[-1]]
        output_csv = Datasheet(fields=headers)
        seen_tweet_ids = []

    # loop through the ids in the input csv. if we see one that's not already been reverse geocoded,
    # try to reverse geocode
    for row in input_csv.rows:
        if row[-1] not in seen_tweet_ids:
            # we have not yet reverse geocoded this tweet
            lat = row[0]
            lng = row[1]
            latlng = str(lat) + ',' + str(lng)
            results = getTweets.reverse_geocode(latlng)
            if results:
                print results
                # retain id as the last element in the row, but insert state, county, country before it
                try:
                    tmp_row = row[:-1]
                    id = row[-1]
                    tmp_row += [results['state'], results['county'], results['country']]
                    tmp_row.append(id)
                    output_csv.append(tmp_row)
                except:
                    print results
                    break
            time.sleep(2)
        output_csv.save(args.o, headers=True)

    # get AWS login credentials
    [aws_key_id, aws_secret_key] = s3_utils.getCredentials(args.aws_cred_file)

    # connect to amazon s3 and upload tweet data
    # assumes AWS environment variables are set
    s3_utils.pushToS3(args.o, aws_key_id, aws_secret_key, args.bucket, name=os.path.basename(args.o))
