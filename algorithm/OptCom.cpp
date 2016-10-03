#include "OptCom.h"

using namespace Ipopt;

opt_com_nlp :: opt_com_nlp(set <string> orgs, map < string, set <string> > ins,
	map <string, double> u, map <string , double> c) {

	feed = u;

	ifstream all("./org_files/all.txt");
	ofstream log("./org_files/res.txt");

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

	int n_count = 0, m_count = 0;

	s1_mat_n.resize(orgs.size());
	s2_mat_n.resize(orgs.size());
	s1_mat_m.resize(orgs.size());
	s2_mat_m.resize(orgs.size());

	//cout << 1 << endl;

	int index = 0;
	for (auto i = orgs.begin(); i != orgs.end(); ++ i) {
		ifstream org("./org_files/" + (*i) + ".txt");

		map <string, int> s_mer_to_index;
		map <string, int> s1_mer_to_index;
		map <string, int> s2_mer_to_index;

		s1_mat_n_mer.push_back(vector <string>());
		s2_mat_n_mer.push_back(vector <string>());

		s1_mat_n[index] = s1_mat_m[index] = s2_mat_m[index] = s2_mat_n[index] = 0;

		int ec_count; org >> ec_count;
		
		map < int , map <int, int> > s1n;
		map < int , map <int, int> > s2n;
		
		bool flag1, flag2;
		//cout << "ORG" << index << ' ' << ec_count << endl;
		for (int ec_idx = 0; ec_idx < ec_count; ++ ec_idx) {
			string ec_name; int mer_size;
			org >> ec_name >> mer_size;

			set <string> s_list;
			
			flag1 = flag2 = false;

			for (int j = 0; j < mer_size; ++ j) {
				string mer_name; org >> mer_name;

				if (0 == s_mer_to_index.count(mer_name)) {
					s_mer_to_index.insert(make_pair(mer_name, n_count ++));
					s_mat_n_mer.push_back(to_string(index) + mer_name);
				}

				s_list.insert(mer_name);
			}

			for (auto j = s_list.begin(); j != s_list.end(); ++ j) {
				int x; org >> x;
				s_mat[m_count][s_mer_to_index[* j]] = x;
				if (u.count(* j)) {
					flag2 = true; //cout << 2 << ' ' << index << endl;
					if (0 == s2_mer_to_index.count(* j)) {
						s2_mer_to_index.insert(make_pair(* j, s2_mat_n[index] ++));
						s2_mat_n_mer[index].push_back(*j);
					}
					s2n[s2_mat_m[index]][s2_mer_to_index[* j]] = x;
				}
				else {
					flag1 = true; //cout << 1 << ' ' << index << endl;
					if (0 == s1_mer_to_index.count(* j)) {
						s1_mer_to_index.insert(make_pair(* j, s1_mat_n[index] ++));
						s1_mat_n_mer[index].push_back(*j);
					}
					s1n[s1_mat_m[index]][s1_mer_to_index[* j]] = x;
				}
			}

			if (flag1)
				++ s1_mat_m[index];
			if (flag2)
				++ s2_mat_m[index];

			++ m_count;
		}

		org.close();

		for (auto ec_idx = ins[*i].begin(); ec_idx != ins[*i].end(); ++ ec_idx) {
			string ec_name = * ec_idx;
			flag1 = flag2 = false;

			for (auto k = ec_list[ec_name].begin(); k != ec_list[ec_name].end(); ++ k) {
				string mer_name = k -> first;
				if (0 == s_mer_to_index.count(mer_name)) {
					s_mer_to_index.insert(make_pair(mer_name, n_count ++));
					s_mat_n_mer.push_back(to_string(index) + mer_name);
				}
				s_mat[m_count][s_mer_to_index[mer_name]] = k -> second;
				
				if (u.count(mer_name)) {
					flag2 = true;
					if (0 == s2_mer_to_index.count(mer_name)) {
						s2_mer_to_index.insert(make_pair(mer_name, s2_mat_n[index] ++));
						s2_mat_n_mer[index].push_back(mer_name);
					}
					s2n[s2_mat_m[index]][s2_mer_to_index[mer_name]] = k -> second;
				}
				else {
					flag1 = true;
					if (0 == s1_mer_to_index.count(mer_name)) {
						s1_mer_to_index.insert(make_pair(mer_name, s1_mat_n[index] ++));
						s1_mat_n_mer[index].push_back(mer_name);
					}
					s1n[s1_mat_m[index]][s1_mer_to_index[mer_name]] = k -> second;
				}
			}
			
			if (flag1)
				++ s1_mat_m[index];
			if (flag2)
				++ s2_mat_m[index];

			++ m_count;
		}
		s1_mat.push_back(s1n);
		s2_mat.push_back(s2n);
		++ index;
	}

	s_mat_n = s_mat_n_old = n_count;
	s_mat_m = s_mat_m_old = m_count;

	for (size_t i = 0; i < orgs.size(); ++ i) {
		for (auto row = s1_mat[i].begin(); row != s1_mat[i].end(); ++ row) {
			for (auto col = row -> second.begin(); col != row -> second.end(); ++ col) {
				s_mat[col -> first + s_mat_m][row -> first + s_mat_n] = col -> second;
			}
		}
		s_mat_m += s1_mat_n[i];
		s_mat_n += s1_mat_m[i];
	}
/*
	for (int i = 0; i < s_mat_m; ++ i) {
		for (int j = 0; j < s_mat_n; ++ j)
			log << s_mat[i][j] << ' ';
		log << endl;
	}

	log << endl;

	for (size_t i = 0; i < orgs.size(); ++ i) {
		log << i << ' ' << s1_mat_m[i] << ' ' << s1_mat_n[i] << endl;
		for (int x = 0; x < s1_mat_m[i]; ++ x) {
			for (int y = 0; y < s1_mat_n[i]; ++ y)
				log << s1_mat[i][x][y] << ' ';
			log << endl;
		}
	}

	for (size_t i = 0; i < orgs.size(); ++ i) {
		log << i << ' ' << s2_mat_m[i] << ' ' << s2_mat_n[i] << endl;
		for (int x = 0; x < s2_mat_m[i]; ++ x) {
			for (int y = 0; y < s2_mat_n[i]; ++ y)
				log << s2_mat[i][x][y] << ' ';
			log << endl;
		}
	}
*/
	log.close();
};

opt_com_nlp :: ~opt_com_nlp() {};

bool opt_com_nlp :: get_nlp_info(Index& n, Index& m, Index& nnz_jac_g,
	Index& nnz_h_lag, IndexStyleEnum& index_style) {

	n = s_mat_n;
	m = s_mat_m;

	nnz_jac_g = s_mat_m;
	nnz_h_lag = s_mat_n * s_mat_n;

	index_style = TNLP :: C_STYLE;
	return true;
}

bool opt_com_nlp :: get_bounds_info(Index n, Number* x_l, Number* x_u,
	Index m, Number* g_l, Number* g_u) {

	for (int i = 0; i < s_mat_n_old; ++ i) {
		x_l[i] = 0.0; x_u[i] = 2e19;
	}

	for (int i = s_mat_n_old; i < s_mat_n; ++ i) {
		x_l[i] = -2e19; x_u[i] = 2e19;
	}

	for (int i = 0; i < s_mat_m_old; ++ i)
		g_l[i] = g_u[i] = 0.0;

	for (int i = s_mat_m_old; i < s_mat_m; ++ i) {
		g_u[i] = 2e19; g_l[i] = 1.0;
	}

	return true;
}

bool opt_com_nlp :: get_starting_point(Index n, bool init_x, Number* x,
	bool init_z, Number* z_L, Number* z_U,
	Index m, bool init_lambda,
	Number* lambda) {

	assert(init_x == false);
	assert(init_z == false);
	assert(init_lambda == false);

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
