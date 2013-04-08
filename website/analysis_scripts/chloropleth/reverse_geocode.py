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

# CSV, JSON and URL libraries
import time
import csv, re, cStringIO, codecs
import json, urllib
from pattern.db  import Datasheet, pprint

# globals to configure our geocode parser
GEOCODE_BASE_URL = 'http://maps.googleapis.com/maps/api/geocode/json'
RESULT_FORMAT = u'short_name'
DESIRED_INFO = ['administrative_area_level_1']
geo_output="Tweets_geocoded.csv"

##class UnicodeWriter:
##    """
##    A CSV writer which will write rows to CSV file "f",
##    which is encoded in the given encoding.
##    """
##
##    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
##        # Redirect output to a queue
##        self.queue = cStringIO.StringIO()
##        self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
##        self.stream = f
##        self.encoder = codecs.getincrementalencoder(encoding)()
##
##    def writerow(self, row):
##        self.writer.writerow([s.encode("utf-8") for s in row])
##        # Fetch UTF-8 output from the queue ...
##        data = self.queue.getvalue()
##        data = data.decode("utf-8")
##        # ... and reencode it into the target encoding
##        data = self.encoder.encode(data)
##        # write to the target stream
##        self.stream.write(data)
##        # empty queue
##        self.queue.truncate(0)
##
##    def writerows(self, rows):
##        for row in rows:
##            self.writerow(row)
##

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
        return geonames[0][RESULT_FORMAT]
    except: return "blah"
    

    
if __name__ == '__main__':
    # Test
    #getGeo = reverse_geocode(latlng="40.714224,-73.961452",sensor="false")
    #print getGeo

##    tweet_headers = ['lat', 'long', 'author', 'year', 'month', 'day', 'hour',
##                     'minute', 'text', 'hashtags', 'search_term', 'id', 'State']
##
##    try:
##        table = Datasheet.load(geo_output, headers=True)
##    except:
##        tweet_types = [(x, 'string') for x in tweet_headers]
##        headers = tweet_types
##        table = Datasheet(fields=headers)
        
    with open('tweets.csv', 'rb') as inputcsv:
      with open('tweets_geocoded.csv', 'wb') as outputcsv:
          # instantiate csv reader, writer objects
              reader = csv.reader(inputcsv)
              writer = csv.writer(outputcsv)
              #writer = UnicodeWriter(outputcsv)

              # grab the header field from first row, and write out
              header = reader.next()
              header.append('State')
              writer.writerow(header)

              # append state info to each tweet
              #for i in xrange(10):
              
              for line in reader:
                  try:
                      #line[2] = unicode(line[2])
                      #line[8] = unicode(line[8])
                      #line[8] = line[8].encode('ascii', 'ignore')
                      #line[2] = line[2].encode('ascii', 'ignore')

                      lati = line[0]
                      longi = line[1]
                      if lati != '0' and longi != '0':
                          latlng = lati+','+longi
                          #print latlng
                          state = reverse_geocode(latlng)
                          if state == u'OVER_QUERY_LIMIT':
                              time.sleep(2)
                              state = reverse_geocode(latlng)
                              if state == u'OVER_QUERY_LIMIT':
                                  print 'Over DAILY query limit'
                                  break
                      else: state = "UNKNOWN"
                      if state == "blah": state = "UNKNOWN"
                      line.append(state)
                      #table.append(state)
                      writer.writerow(line)
                  except UnicodeEncodeError:
                      print line[2], line[8]
                      continue

    #table.save(geo_output, headers=True)
