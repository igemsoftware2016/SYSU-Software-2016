#include "input_utils.h"
using namespace mol;

int main() {

	vector <reaction> reaction_list;
	map <string, substance> substance_list;

	if(false == input_initial(reaction_list, substance_list))
		return 1;

	ofstream res("result.txt");
	
	res << reaction_list.size() << endl;
	for (size_t i = 0; i < reaction_list.size(); ++ i) {
		res << reaction_list[i].ec_name << '\t';
		res << reaction_list[i].sub.size() + reaction_list[i].pdt.size() << '\t';
		for (auto j = reaction_list[i].sub.begin();
			j != reaction_list[i].sub.end(); ++ j)
			res << ((substance_list[j -> first].ID == "") ? (substance_list[j -> first].name) : (substance_list[j -> first].ID)) << '\t';
		for (auto j = reaction_list[i].pdt.begin();
			j != reaction_list[i].pdt.end(); ++ j)
			res << ((substance_list[j -> first].ID == "") ? (substance_list[j -> first].name) : (substance_list[j -> first].ID)) << '\t';
		for (auto j = reaction_list[i].sub.begin();
			j != reaction_list[i].sub.end(); ++ j)
			res << j -> second << '\t';
		for (auto j = reaction_list[i].pdt.begin();
			j != reaction_list[i].pdt.end(); ++ j)
			res << -(j -> second) << '\t';
		res << endl;
	}

	res.close();

	return 0;
}

