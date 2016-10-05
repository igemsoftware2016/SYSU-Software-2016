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
	SmartPtr<IpoptApplication> app = IpoptApplicationFactory();

	app -> Options() -> SetStringValue("hessian_approximation", "limited-memory");
	app -> Options() -> SetStringValue("jac_c_constant", "yes");
	app -> Options() -> SetStringValue("jac_d_constant", "yes");
	app -> Options() -> SetStringValue("print_user_options", "yes");
	app -> Options() -> SetStringValue("output_file", "OPO.txt");
	app -> Options() -> SetIntegerValue("print_level", 0);
	app -> Options() -> SetIntegerValue("file_print_level", 5);
	app -> Options() -> SetNumericValue("max_cpu_time", 30.0);

	ApplicationReturnStatus status;
	status = app->Initialize();

	if (status != Solve_Succeeded) {
		std::cout << std::endl << std::endl << "*** Error during initialization!" << std::endl;
		return (int) status;
	}

	status = app->OptimizeTNLP(nlp);

	if (status == Solve_Succeeded) {
		Index iter_count = app->Statistics()->IterationCount();
		std::cout << std::endl << std::endl << "*** The problem solved in " << iter_count << " iterations!" << std::endl;

		Number final_obj = app->Statistics()->FinalObjective();
		std::cout << std::endl << std::endl << "*** The final value of the objective function is " << final_obj << '.' << std::endl;
	}

	return 0;
}
