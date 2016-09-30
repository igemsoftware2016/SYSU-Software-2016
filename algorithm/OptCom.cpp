#include "OptCom.h"

using namespace Ipopt;

opt_com_nlp :: opt_com_nlp(set <string> orgs, map < string, set <string> >) {
	ifstream all("./org_files/all.txt");
	ofstream res("./org_files/res.txt");

	int ec_count;
	all >> ec_count;
	map < string, map <string, int> > ec_list;

	for (int i = 0; i < ec_count; ++ i) {
		string ec_name; int mer_size;
		all >> ec_name >> mer_size;
		for (int j = 0; j < mer_size; ++ j) {
			string mer_name; all >> mer_name;
			ec_list[ec_name][mer_name] = 0;
		}
		for (auto j = ec_list[ec_name].begin();
			j != ec_list[ec_name].end(); ++ j)
			all >> (j -> second);
	}

	all.close();

	for (auto i = orgs.begin(); i != orgs.end(); ++ i) {
		ifstream org("./org_files/" + (*i) + ".txt");
		res << "./org_files/" + (*i) + ".txt" << endl;
		org.close();
	}
	
	res.close();
};

opt_com_nlp :: ~opt_com_nlp() {};

bool opt_com_nlp :: get_nlp_info(Index& n, Index& m, Index& nnz_jac_g,
	Index& nnz_h_lag, IndexStyleEnum& index_style) {
	return true;
}

bool opt_com_nlp :: get_bounds_info(Index n, Number* x_l, Number* x_u,
	Index m, Number* g_l, Number* g_u) {
	return true;
}

bool opt_com_nlp :: get_starting_point(Index n, bool init_x, Number* x,
	bool init_z, Number* z_L, Number* z_U,
	Index m, bool init_lambda,
	Number* lambda) {
	return true;
}

bool opt_com_nlp :: eval_f(Index n, const Number* x,
	bool new_x, Number& obj_value) {
	return true;
}

bool opt_com_nlp :: eval_grad_f(Index n, const Number* x,
	bool new_x, Number* grad_f) {
	return true;
}

bool opt_com_nlp :: eval_g(Index n, const Number* x, bool new_x,
	Index m, Number* g) {
	return true;
}

bool opt_com_nlp :: eval_jac_g(Index n, const Number* x, bool new_x,
	Index m, Index nele_jac, Index* iRow, Index *jCol,
	Number* values) {
	return true;
}

/*
bool opt_com_nlp :: eval_h(Index n, const Number* x, bool new_x,
	Number obj_factor, Index m, const Number* lambda,
	bool new_lambda, Index nele_hess, Index* iRow,
	Index* jCol, Number* values) {
	return true;
}
*/

void opt_com_nlp :: finalize_solution(SolverReturn status,
	Index n, const Number* x, const Number* z_L, const Number* z_U,
	Index m, const Number* g, const Number* lambda,
	Number obj_value,
	const IpoptData* ip_data,
	IpoptCalculatedQuantities* ip_cq) {

}
