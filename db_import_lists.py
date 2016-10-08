from application import db
from application.model import *
import os
nowdir = os.path.abspath(os.path.dirname(__file__))

f = open(os.path.join(nowdir, 'mar_total.txt'), 'r')
while True:
	line = f.readline()
	if line:
		new_matter = matterDB(line[0:line.find(' ')], line[line.find(' ') + 1:])
		new_matter.save()
	else:
		break
f.close()


