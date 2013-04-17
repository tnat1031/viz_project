"""
general utils for working with AWS S3

@author: Ted Natoli
@email: tnatoli@broadinstitute.org

November 2012
"""


import os, boto

def makeS3grp(bucket, folder, outdir):
	''' make a grp file listing s3 contents and return path to it
		need to update this to use boto
	'''

	s3_path = os.path.join(bucket, folder)
	outpath = os.path.join(outdir, 's3_files.grp')
	cmd = "aws ls --simple " + s3_path + " | cut -f3 | cut -f2 -d \/  | sed 's/.tar/@/' | cut -f1 -d @ > " + outpath
	os.system(cmd)

	return outpath

def s3ListFolder(aws_key_id, aws_secret_key, bucket, folder, strip_ext=False):
	'''
	list the contents of a folder in an s3 bucket
	'''
	conn = boto.connect_s3(aws_key_id, aws_secret_key)
	b = conn.get_bucket(bucket)
	current_s3_files = []
	for x in b.list(folder):
		if strip_ext:
			current_s3_files.append(os.path.splitext(os.path.splitext(os.path.basename(x.key))[0])[0])
		else:
			current_s3_files.append(os.path.basename(x.key))
	return current_s3_files

def s3Remove(file, aws_key_id, aws_secret_key, bucket, folder, ext=None):
	'''
	delete a file from s3
	'''
	conn = boto.connect_s3(aws_key_id, aws_secret_key)
	b = conn.get_bucket(bucket)
	k = boto.s3.key.Key(b)
	if ext:
		k.key = os.path.join(folder, file + ext)
	else:
		k.key = os.path.join(folder, file)
	print 'deleting ' + k.key
	b.delete_key(k)

def pushToS3(file, aws_key_id, aws_secret_key, bucket, folder=None, name=None):
	''' upload file to s3 bucket/folder and return the number of bytes
	transferred
	'''

	conn = boto.connect_s3(aws_key_id, aws_secret_key)
	b = conn.get_bucket(bucket)
	k = boto.s3.key.Key(b)

	if name:
		# was a custom filename provided?
		# could include an s3 path
		k.name = name

	elif folder:
		if file.startswith('/'):
			# is it an absolute path?
			k.name = os.path.join(folder, file[1:])
		else:
			k.name = os.path.join(folder, file)
	else:
		k.name = file
	print 'uploading ' + k.name + ' to S3'
	return k.set_contents_from_filename(file, reduced_redundancy=True, policy='public-read')

def getCredentials(file):
	'''
	open file and remove aws_key_id and aws_secret_key.
	assumes these values are stored one per line, in that order
	'''
	f = open(file, 'r')
	lines = []
	for line in f.readlines():
		lines.append(line.strip())
	if len(lines) != 2:
		return None
	else:
		return lines

def s3FileExists(aws_key_id, aws_secret_key, bucket, name):
	'''
		return whether file with given name exists in s3.
		name needs to contain folder info if applicable
	'''
	conn = boto.connect_s3(aws_key_id, aws_secret_key)
	b = conn.get_bucket(bucket)
	k = b.get_key(name)
	if k:
		return True
	else:
		return False
