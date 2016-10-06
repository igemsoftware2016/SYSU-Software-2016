#include "IpIpoptApplication.hpp"
#include "IpSolveStatistics.hpp"
#include "dOptCom.h"

#include <iostream>

using namespace Ipopt;

int main() {
	std :: ios :: sync_with_stdio(false);

	ifstream dopt("dopt.txt");

	set <string> s;

	int org_size;
	dopt >> org_size;
	for (int i = 0; i < org_size; ++ i) {
		string str; dopt >> str;
		s.insert(str);
	}

	map < string, set <string> > m;
	map <string, double> u_tot, c;

	for (int i = 0; i < org_size; ++ i) {
		string name, insert_ge; int insert_size;
		dopt >> name >> insert_size;
		for (int j = 0; j < insert_size; ++ j) {
			dopt >> insert_ge;
			m[name].insert(insert_ge);
		}
	}

	int u_size; dopt >> u_size;
	for (int i = 0; i < 13; ++ i) {
		string mer; double tot;
		dopt >> mer >> tot;
		u_tot[mer] = tot;
	}

	int c_size; dopt >> c_size;
	for (int i = 0; i < 5; ++ i) {
		string mer; double coeff;
		dopt >> mer >> coeff;
		c[mer] = coeff;
	}

	map <string, double> ct;

	int mer_size; dopt >> mer_size;
	for (int i = 0; i < mer_size; ++ i) {
		string mer; double ori;
		dopt >> mer >> ori;
		ct[mer] = ori;
	}

	ofstream dopt_res("dopt_res.txt");

	for (int time_slice = 1; time_slice <= 20; ++ time_slice) {
		map <string, double> u;
		for (auto k = u_tot.begin(); k != u_tot.end(); ++ k) {
			u[k -> first] = k -> second / time_slice;
		}

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
		dopt_res << time_slice << endl;
	}

	dopt_res.close();

	return 0;
}
