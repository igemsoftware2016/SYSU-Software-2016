#include "input_utils.h"

#include <unistd.h>
#include <algorithm>

using std :: min;
using std :: max;
using std :: sort;

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

	ofstream res("trans_result.txt");
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

	set <string> able;

	ifstream tra("transporters.col");
	string str = first_useful(tra);

	while (getline(tra, str)) {
		if (str.find("[extracellular space]") == string :: npos)
			continue;
		int pos = str.find("[extracellular space]") - 1;

		string s; s = str[pos] + s; -- pos;
		while (str[pos] != '\t' && str[pos] != '+' && str[pos] != '>') {
			s = str[pos] + s;
			-- pos;
		}
		
		s = all_caps(s);
		
		while (s[0] == ' ')
			s = s.substr(1);
		
		log << s << '|' << endl;

		if ((s[0] == 'A' && s[1] == ' ') ||
			(s[0] == 'A' && s[1] == 'N' && s[2] == ' ')) {
			s = s.substr(s.find(' ') + 1);
			for (auto k = substance_list.begin();
				k != substance_list.end(); ++ k) {
				
				if (able.count(k -> first))
					break;

				for (auto p = k -> second.types.begin();
					p != k -> second.types.end(); ++ p) {
					if ((*p).find(s)) {
						able.insert(k -> first);
						break;
					}
				}
			}
		} else {
			for (auto k = substance_list.begin();
				k != substance_list.end(); ++ k) {
				
				if (able.count(k -> first))
					break;

				for (auto p = k -> second.comm.begin();
					p != k -> second.comm.end(); ++ p) {
					if ((*p).find(s)) {
						able.insert(k -> first);
						break;
					}
				}
			}
		}
	}

	tra.close();
	
	for (auto k = able.begin(); k != able.end(); ++ k)
		res << "\"" << orgname << "\"\t\"" << ((substance_list[*k].ID == "") ? (substance_list[*k].name) : (substance_list[*k].ID)) << '\"' << endl;
	
	log.close();
	res.close();
	
	return 0;
}

