#include "IpIpoptApplication.hpp"
#include "IpSolveStatistics.hpp"
#include "OptCom.h"

#include <iostream>

using namespace Ipopt;

int main() {
	std :: ios :: sync_with_stdio(false);

	set <string> s;
	s.insert("O3"); s.insert("O4"); s.insert("O5");

	map < string, set <string> > m;
	map <string, double> u, c;

	m["O4"].insert("EC22");
	m["O5"].insert("EC14"); m["O5"].insert("EC16");
	m["O5"].insert("EC25"); m["O5"].insert("EC26");

	int d[13] = {10, 13, 14, 15, 16, 18, 19, 22, 24, 25, 26, 27, 28};
	string d2[5] = {"C27","C26","C22","C24","C28"};

	for (int i = 0; i < 13; ++ i)
		u["C" + std :: to_string(d[i])] = 1.0;
	for (int i = 0; i < 5; ++ i)
		c[d2[i]] = 1.0;

	SmartPtr <TNLP> nlp = new opt_com_nlp(s, m, u, c);
	return 0;
}
