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
## 
################################################################################

# CSV, JSON and URL libraries
import time
import csv
import json, urllib

# globals to configure our geocode parser
GEOCODE_BASE_URL = 'http://maps.googleapis.com/maps/api/geocode/json'
RESULT_FORMAT = u'short_name'
DESIRED_INFO = ['administrative_area_level_1']

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

    with open('tweets.csv', 'rb') as inputcsv:
      with open('tweets_geocoded.csv', 'wb') as outputcsv:
          # instantiate csv reader, writer objects
              reader = csv.reader(inputcsv)
              writer = csv.writer(outputcsv)

              # grab the header field from first row, and write out
              header = reader.next()
              header.append('State')
              writer.writerow(header)

              # append state info to each tweet
              #for i in xrange(10):
              for line in reader:
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
                  writer.writerow(line)

