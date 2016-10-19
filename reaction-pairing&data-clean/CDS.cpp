#include "input_utils.h"
using namespace mol;

int main() {

char buffer[256];
	if (getcwd(buffer, 256) == NULL) {
		perror("Dude, permitsion denied");
		return 0;
	}

	string orgname = buffer;

	vector <reaction> reaction_list;
	map <string, substance> substance_list;

	if(false == input_initial(reaction_list, substance_list))
		return 1;

	ofstream log("log.txt");

	log << orgname << endl;

	string sw = orgname;
	orgname = "";
	int sw_l = sw.size() - 1;
	while (sw[sw_l] != '/') {
		orgname = sw[sw_l] + orgname;
		-- sw_l;
	}
	log << orgname << endl;

	ofstream res("cds_result.txt");
	ifstream enz("enzymes.col");
	ifstream dna("dnaseq.fsa");
	//NIL "

	map <string, string> en_to_dna;
	string str = first_useful(enz);
	while (getline(enz, str)) {
		string d; int pos = str.size() - 1;
		while (str[pos] != '*') {
			d = str[pos] + d;
			-- pos;
		}

		string enr; pos = 0;
		while (str[pos] != ' ' && str[pos] != '\t') {
			enr += str[pos];
			++ pos;
		}
		
		en_to_dna.insert(make_pair(enr, d));
	}

	log << en_to_dna.size() << endl;

	map <string, string> dna_to_seq;
	string dnan, seq;
	bool first = true;
	while (getline(dna, str)) {

		if (check_element(str, ">gnl")) {
			if (first)
				first = false;
			else
				dna_to_seq.insert(make_pair(dnan, seq));

			int pos1 = str.find("NIL \"") + 5;
			int pos2 = str.find("\" ") - pos1;
			//log << pos1 << ' ' << pos2 << endl;
			dnan = str.substr(pos1, pos2);
			//log << dnan << endl;
			seq = "";
			continue;
		}

		seq += str;
	}

	if (seq != "")
		dna_to_seq.insert(make_pair(dnan, seq));

	log << dna_to_seq.size() << endl;

	enz.close();

	res << orgname << ' ' << reaction_list.size() << endl;
	for (size_t i = 0; i < reaction_list.size(); ++ i) {
		res << reaction_list[i].ec_name << ' ' << reaction_list[i].enr.size() << endl;
		for (auto j = reaction_list[i].enr.begin();
			j != reaction_list[i].enr.end(); ++ j) {
			res << "\t" << (*j) << endl;
		}
	}

	res << en_to_dna.size() << endl;
	for (auto i = en_to_dna.begin(); i != en_to_dna.end(); ++ i) {
		res << i -> first << endl;
		res << dna_to_seq[i -> second] << endl;
		if (dna_to_seq[i -> second] == "")
			log << "ERROR" << endl;
	}

	res.close();
	log.close();

	return 0;
}

