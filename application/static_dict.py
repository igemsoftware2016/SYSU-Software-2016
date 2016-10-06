import os
nowdir = os.path.abspath(os.path.dirname(__file__))

dict_matters = []

f = open(os.path.join(nowdir, 'mar_total.txt'), 'r')
dict_reading_id = 1
while True:
	line = f.readline()
	if line:
		dict_matters.append({'id': dict_reading_id, 'name': line.strip()})
		dict_reading_id += 1
	else:
		break
f.close()
