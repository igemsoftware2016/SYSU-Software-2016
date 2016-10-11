import httplib
import urllib
import json
import sys
import os

MAX_INT = 2000000000

if __name__ == "__main__":
	designID = sys.argv[1]
	if not designID:
		print("Usage: python run_calculate.py [your designID]")
		os._exit()
	connector = httplib.HTTPConnection("127.0.0.1:5000")
	url = '/process/' + designID
	connector.request(method="GET",url=url)
	response = connector.getresponse()
	response_text = response.read()
	response_object = json.loads(response_text)
	# The json should be:
	# state1:
	# {
	# 	"state": 1,
	# 	"mode": "synthetic",
	# 	"matters": [
	# 		{
	# 			"code": "C001",
	# 			"con": 0.1
	# 		},
	# 		{
	# 			"code": "C002",
	# 			"con": 0.2
	# 		}
	# 		{
	# 			"code": "C003",
	# 			"con": 0.3
	# 		}
	# 	],
	# 	"plasmid": [
	# 		{
	# 			"code": "C004",
	# 			"con": 0.1
	# 		},
	# 		{
	# 			"code": "C005",
	# 			"con": 0.5
	# 		}
	# 	]
	# }
	# state2:
	# {
	# 	"state": 2, 
	# 	"bacteria":[
	# 		{
	# 			"code": "C001",
	# 			"enzyme":[
	# 				{
	# 					"name": "E001"
	# 				},
	# 				{
	# 					"name": "E002"
	# 				}
	# 			]
	# 		}
	# 	],
	# 	"initial_matters":[
	# 		{
	# 			"code": "C004",
	# 			"con": 0.1
	# 		},
	# 		{
	# 			"code": "C005",
	# 			"con": 0.5
	# 		}
	# 	],
	# 	"insert_matters":[
	# 		{
	# 			"code": "C001",
	# 			"con": 0.1
	# 		},
	# 		{
	# 			"code": "C002",
	# 			"con": 0.2
	# 		}
	# 		{
	# 			"code": "C003",
	# 			"con": 0.3
	# 		}
	# 	]
	# }
	# TODO: read Kcat
	Kcat = []

	state = response_object.get('state')
	print("The design is now state " + str(state))
	if 'state' == 1:
		# Print data for search & opt-com part
		mode = response_object.get('mode')
		matters = response_object.get('matters')
		plasmid = response_object.get('plasmid')
		search_file = open('query.txt', 'w')
		search_file.write(mode + '\n')
		search_file.write(str(len(matters)) + '\n')
		for m in matters:
			search_file.write(m.get('code') + '\n')
		search_file.write(str(len(plasmid)) + '\n')
		for m in plasmid:
			search_file.write(m.get('code') + ' ' + str(m.get('con')) + '\n')
		search_file.close()
		print("Processing search and opt-com...")
		# Fetch search & opt-com results and calculate promoter & RBS
		os.system('./get-common')

		search_res = open('search_res.txt', 'r')
		n = int(search_res.readline())
		all_promoter_set = []
		all_rbs_set = []
		print("Generating promoter and RBS...")
		for i in range(0, n):
			tmp = search_res.readline().split()
			batt_name = tmp[0]
			gene_count = int(tmp[1])
			tmpenz = search_res.readline().split()
			for j in range(0, gene_count):
				enzyme_name = tmpenz[j * 2]
				batt_from = tmpenz[j * 2 + 1]
				# Cauculate sum energy
				enzyme_Kcat = Kcat.get(enzyme_name)
				if enzyme_Kcat is None:
					enzyme_Kcat = 1
				Ktarget = 6 * matters[j % len(matters)].get('con') / enzyme_Kcat

				# Calculate rbs strength
				os.system('./rbs ' + batt_from + ' ' + enzyme_name);
				rbs_res = open('RBS_output.txt', 'r')
				pro_input = open('promoter_input.txt', 'w')
				rbs_seq_set = []
				pro_seq_set = []
				for k in range(0, 5):
					rbs_seq = rbs_res.readline()
					if rbs_seq is None:
						break
					rbs_strength = float(rbs_res.readline())
					rbs_seq_set.append({"sequence": rbs_seq, "strength": rbs_strength})
					# Record promoter strength
					pro_input.write(Ktarget / rbs_strength)
				rbs_res.close()
				pro_input.close()

				# if RBS has results
				if len(rbs_seq_set) != 0:
					all_rbs_set += rbs_seq_set
					os.system('./promoter')
					promoter_res = open('promoter_res.txt', 'r')
					for k in range(0, 5):
						pro_seq = promoter_res.readline()
						pro_strength = float(promoter_res.readline())
						pro_seq_set.append({"sequence": pro_seq, "strength": pro_strength})
					all_promoter_set.append(pro_seq_set)
		print("Calculation finished. Sending data to server...")
		all_set = {"promoter": all_promoter_set, "rbs": all_rbs_set}
		search_res.close()

		#send post request to server
		headers = {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8", "Accept": "*/*"}
		sent_data = urllib.urlencode(all_set)
		connector.request(method = "POST", url, sent_data, headers)
		sent_response = json.loads(connector.getresponse().read())
		if sent_response.get("code") == 0:
			print("Data have been successfully sent.")
		else:
			print("Error occurred. Contact administrator for more help.")

	if 'state' == 2:
		batt_list = response_object.get('bacteria')
		dopt_input = open("dopt.txt", "w")
		dopt_input.write(str(len(batt_list)) + '\n')
		for batt in batt_list:
			dopt_input.write(batt.get("code") + '\n')
		for batt in batt_list:
			dopt_input.write(batt.get("code") + ' ' + str(len(batt.get('enzyme'))) + '\n')
			for enzy in batt.get('enzyme'):
				dopt_input.write(batt.get("name") + '\n')
		insert_list = response_object.get('insert_matters')
		dopt_input.write(str(len(insert_list)) + '\n')
		for matter in insert_list:
			dopt_input.write(str(matter.get("code")) + ' ' + str(matter.get("con")) + '\n')
		dopt_input.write('0\n')
		initial_list = response_object.get("initial_matters")
		for matter in initial_list:
			dopt_input.write(str(matter.get("code")) + ' ' + str(matter.get("con")) + '\n')
		dopt_input.close()
		print("Running d-OptCom...")
		os.system('./dOptCom')

		print("D-OptCom finished. Processing data...")
		dopt_res = open("dopt_res.txt", "r")
		res_point = dict()
		mattern = 0
		readtmp = dopt_res.readline()
		for i in range(20):
			if readtmp is None:
				break
			if i == 0:
				readtmp = dopt_res.readline()
				while readtmp != "2":
					tmpset = readtmp.split()
					res_point[tmpset[0]] = [0 for i in range(20)]
					res_point[tmpset[0]][0] = float(tmpset[1])
					mattern += 1
					readtmp = dopt_res.readline()
			else:
				for j in range(mattern):
					readtmp = dopt_res.readline()
					tmpset = readtmp.split()
					res_point[tmpset[0]][i] = float(tmpset[1])
				readtmp = dopt_res.readline()
		dopt_res.close()

		headers = {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8", "Accept": "*/*"}
		sent_res = {"code":0, "data": res_point}
		sent_data = urllib.urlencode(sent_res)
		connector.request(method = "POST", url, sent_data, headers)
		sent_response = json.loads(connector.getresponse().read())
		if sent_response.get("code") == 0:
			print("Data successfully sent.")
		else:
			print("Error occurred. Contact administrator for more help.")
