import os
import sys

basedir = os.path.abspath(os.path.dirname(__file__))

if __name__ == "__main__":
	if sys.argv[1]:
		os.system("wkhtmltopdf ./tmp_protocol.html " + os.path.join(basedir, 'static/pdf/%s.pdf' % sys.argv[1]))