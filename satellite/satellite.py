#!/usr/bin
import httplib
import urllib
import json
import sys
import os

MAX_INT = 2000000000

if __name__ == "__main__":
	if len(sys.argv) < 2:
		print("\nUsage: \npython run_calculate.py [your designID]\n")
		os._exit(0)
	designID = sys.argv[1]
	connector = httplib.HTTPConnection("craft.sysusoftware.info")
	url = '/process/' + designID
	connector.request(method="GET",url=url)
	response = connector.getresponse()
	response_text = response.read()
	# print response_text
	response_object = json.loads(response_text)

	Kcat = {}
	kcat_file = open('kcat_kcat.txt', 'r')
	while True:
		line = kcat_file.readline().strip()
		if line:
			tname = line[0 : line.find(',')]
			try:
				tkcat = float(line[line.rfind(',') + 1 : ])
			except Exception, e:
				tkcat = 1
			Kcat[tname] = tkcat
		else:
			break
	# print(Kcat)

	state = int(response_object.get('state'))
	print("The design is now state " + str(state))
	if state == 2:
		# Print data for search & opt-com part
		mode = response_object.get('mode')
		matters = response_object.get('matters')
		medium = response_object.get('medium')
		search_file = open('query.txt', 'w')
		search_file.write(mode + '\n')
		search_file.write(str(len(matters)) + '\n')
		for m in matters:
			search_file.write(m.get('code') + '\n')
		search_file.write(str(len(medium)) + '\n')
		for m in medium:
			search_file.write(m.get('code') + ' ' + str(m.get('con')) + '\n')
		search_file.close()
		print("Processing search and opt-com...")
		# Fetch search & opt-com results and calculate promoter & RBS
		os.system('./get-common')

		search_res = open('search_res.txt', 'r')
		n = int(search_res.readline())
		all_bact_set = []
		print("Generating promoter and RBS...")
		for i in range(0, n):
			tmp = search_res.readline().split()
			batt_name = tmp[0]
			gene_count = int(tmp[1])
			tmpenz = search_res.readline().split()
			bact_set = {}
			bact_set["name"] = batt_name
			bact_set["enzyme"] = []
			for j in range(0, gene_count):
				enzyme_name = tmpenz[j * 2]
				batt_from = tmpenz[j * 2 + 1]

				# Cauculate sum energy
				enzyme_Kcat = Kcat.get(enzyme_name[enzyme_name.find('-') + 1 : enzyme_name.find('_')])
				if enzyme_Kcat is None:
					enzyme_Kcat = 1
				Ktarget = 6 * matters[j % len(matters)].get('con') / enzyme_Kcat

				# Calculate rbs strength
				# print(batt_from + ' ' + enzyme_name)
				os.system('./rbs ' + batt_from + ' ' + enzyme_name);
				rbs_res = open('RBS_output.txt', 'r')
				pro_input = open('promoter_input.txt', 'w')
				rbs_seq_set = []
				pro_seq_set = []
				enzy_seq = rbs_res.readline().strip()
				weight = 1.0
				for k in range(0, 5):
					rbs_seq = rbs_res.readline().strip()
					if rbs_seq is None:
						break
					rbs_strength = float(rbs_res.readline().strip())
					if rbs_strength < 0:
						rbs_strength *= -1
					rbs_seq_set.append({"sequence": rbs_seq, "strength": rbs_strength})
					# Dump promoter strength
					pro_stren = 1 / rbs_strength
					if pro_stren < 0:
						pro_stren *= -1
					if k == 0:
						while pro_stren * weight < 0.05:
							weight *= 10
					pro_input.write(str(pro_stren * weight) + '\n')
				rbs_res.close()
				pro_input.close()

				# if RBS has results
				if len(rbs_seq_set) != 0:
					os.system('./promoter')
					promoter_res = open('promoter_res.txt', 'r')
					for k in range(0, 5):
						pro_seq = promoter_res.readline().strip()
						pro_strength = float(promoter_res.readline().strip())
						pro_seq_set.insert(0, {"sequence": pro_seq, "strength": pro_strength})
					promoter_res.close()
				# enzy_seq = "this_is_testing_enzyme_sequence_ACGTACGT"
				bact_set["enzyme"].append({"name": enzyme_name, "from": batt_from, "sequence": enzy_seq, "promoter": pro_seq_set, "rbs": rbs_seq_set})
			all_bact_set.append(bact_set)
		search_res.close()
		print("Calculation finished. Sending data to server...")
		all_set = {"code": 0, "bacteria": all_bact_set}

		# print(all_set)

		#send post request to server
		headers = {"Content-type": "application/json; charset=UTF-8", "Accept": "*/*"}
		sent_data = json.dumps(all_set)
		connector.request("POST", url, sent_data, headers)
		try:
			sent_response = json.loads(connector.getresponse().read())
			if sent_response.get("code") == 0:
				print("Data have been successfully sent.")
			else:
				print("Error occurred. Contact administrator for more help.")
		except:
			print("Upload failed. Contact administrator for more help.")


	elif state == 3:
		batt_list = response_object.get('bacteria')
		dopt_input = open("dopt.txt", "w")
		dopt_input.write(str(len(batt_list)) + '\n')
		for batt in batt_list:
			dopt_input.write(batt.get("code") + '\n')
		for batt in batt_list:
			dopt_input.write(batt.get("code") + ' ' + str(len(batt.get('enzyme'))) + '\n')
			for enzy in batt.get('enzyme'):
				dopt_input.write(enzy + '\n')
		insert_list = response_object.get('insert_matters')
		dopt_input.write(str(len(insert_list)) + '\n')
		for matter in insert_list:
			dopt_input.write(str(matter.get("code")) + ' ' + str(matter.get("con")) + '\n')
		dopt_input.write('0\n')
		initial_list = response_object.get("initial_matters")
		dopt_input.write('0\n')
		for matter in initial_list:
			dopt_input.write(str(matter.get("code")) + ' ' + str(matter.get("con")) + '\n')
		dopt_input.close()
		print("Running d-OptCom...")
		os.system('./dOptCom')

		print("D-OptCom finished. Processing data...")
		dopt_res = open("dopt_res.txt", "r")
		res_point = dict()
		mattern = 0
		readtmp = dopt_res.readline().strip()
		for i in range(1, 21):
			if readtmp is None:
				break
			if i == 0:
				readtmp = dopt_res.readline().strip()
				while readtmp != "2":
					tmpset = readtmp.split()
					res_point[tmpset[0]] = [0 for i in range(21)]
					res_point[tmpset[0]][0] = float(tmpset[len(tmpset) - 1])
					mattern += 1
					readtmp = dopt_res.readline().strip()
			else:
				for j in range(mattern):
					readtmp = dopt_res.readline().strip()
					tmpset = readtmp.split()
					res_point[tmpset[0]][i] = float(tmpset[1])
				readtmp = dopt_res.readline().strip()
		dopt_res.close()

		headers = {"Content-type": "application/json; charset=UTF-8", "Accept": "*/*"}
		sent_res = {"code":0, "data": res_point}
		sent_data = json.dumps(sent_res)
		connector.request("POST", url, sent_data, headers)
		sent_response = json.loads(connector.getresponse().read())
		if sent_response.get("code") == 0:
			print("Data successfully sent.")
		else:
			print("Error occurred. Contact administrator for more help.")
