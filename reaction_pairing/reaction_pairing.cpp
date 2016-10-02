#include "input_utils.h"
using namespace mol;

int main() {

	vector <reaction> reaction_list;
	map <string, substance> substance_list;

	if(false == input_initial(reaction_list, substance_list))
		return 1;

	return 0;
}

