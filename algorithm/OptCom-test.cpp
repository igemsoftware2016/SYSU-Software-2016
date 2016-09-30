#include "IpIpoptApplication.hpp"
#include "IpSolveStatistics.hpp"
#include "OptCom.h"

#include <iostream>

using namespace Ipopt;

int main() {

	set <string> s;
	s.insert("O3"); s.insert("O4"); s.insert("O5");

	map < string, set <string> > m;
	
	m["O4"].insert("EC22");
	m["O5"].insert("EC14"); m["O5"].insert("EC16");
	m["O5"].insert("EC25"); m["O5"].insert("EC26");

	SmartPtr <TNLP> nlp = new opt_com_nlp(s, m);
	return 0;
}
