#include "OptCom.h"

using namespace Ipopt;

opt_com_nlp :: opt_com_nlp(set <string> orgs, map < string, set <string> > ins,
	map <string, double> u, map <string , double> c) {

	feed = u; org_size = orgs.size();

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

	int n_count = 0, m_count = 0, last_m = 0;

	int index = 0;
	
	s1_mat_n.resize(org_size);
	s1_mat_m.resize(org_size);

	for (auto i = orgs.begin(); i != orgs.end(); ++ i) {
		ifstream org("./org_files/" + (*i) + ".txt");

		map <string, int> s_mer_to_index, s1_mer_to_index;
		s1_mat_m[index] = s1_mat_n[index] = 0;

		int ec_count; org >> ec_count; log << ec_count << endl;
		
		map < int , map <int, int> > s1n;

		for (int ec_idx = 0; ec_idx < ec_count; ++ ec_idx) {
			string ec_name; int mer_size;
			org >> ec_name >> mer_size;

			vector <string> s_list;
			
			for (int j = 0; j < mer_size; ++ j) {
				string mer_name; org >> mer_name;

				if (0 == s_mer_to_index.count(mer_name)) {
					s_mer_to_index.insert(make_pair(mer_name, m_count ++));
					s1_mer_to_index.insert(make_pair(mer_name, s1_mat_m[index] ++));
					s_mat_m_mer_name.push_back(mer_name);
				}

				s_list.push_back(mer_name);
			}

			for (auto j = s_list.begin(); j != s_list.end(); ++ j) {
				int x; org >> x;
				s_mat[s_mer_to_index[* j]][n_count] = x;
				s1n[s1_mer_to_index[* j]][s1_mat_n[index]] = x;
			}

			++ n_count;
			++ s1_mat_n[index];
		}

		org.close();
		
		if (ins.count(* i))
		for (auto ec_idx = ins[*i].begin(); ec_idx != ins[*i].end(); ++ ec_idx) {
			string ec_name = * ec_idx;

			for (auto k = ec_list[ec_name].begin(); k != ec_list[ec_name].end(); ++ k) {
				string mer_name = k -> first;
				if (0 == s_mer_to_index.count(mer_name)) {
					s_mer_to_index.insert(make_pair(mer_name, m_count ++));
					s1_mer_to_index.insert(make_pair(mer_name, s1_mat_m[index] ++));
					s_mat_m_mer_name.push_back(mer_name);
				}
				s_mat[s_mer_to_index[mer_name]][n_count] = k -> second;
				s1n[s1_mer_to_index[mer_name]][s1_mat_n[index]] = k -> second;
			}

			++ n_count;
			++ s1_mat_n[index];
		}

		for (auto j = u.begin(); j != u.end(); ++ j) {
			for (int k = last_m; k < m_count; ++ k)
				if (s_mat_m_mer_name[k] == (j -> first))
					s_mat[k][n_count] = 1;
			++ n_count;
		}

		s1_mat.push_back(s1n);
		++ index;
		last_m = m_count;
	}

	s_mat_n = s_mat_n_s = n_count;
	s_mat_m = s_mat_m_s = m_count;
	
	s2_mat_n = 0;
	s2_mat.resize(org_size);
	s2_mat_m.resize(org_size);

	for (int i = 0; i < org_size; ++ i) {
		for (int x = 0; x < s1_mat_m[i]; ++ x)
			for (int y = 0; y < s1_mat_n[i]; ++ y)
				if (s1_mat[i][x].count(y))
					s_mat[s_mat_m + y][s_mat_n + x] = s1_mat[i][x][y];
		s_mat_n += s1_mat_m[i];
		s_mat_m += s1_mat_n[i];
	}
	
	n_count = s_mat_n;
	m_count = s_mat_m;

	for (auto i = u.begin(); i != u.end(); ++ i) {
		int cnt = 0;
		for (int j = 0; j < org_size; ++ j) {
			s2_mat_m[j] = s1_mat_m[j];
			for (int k = 0; k < s2_mat_m[j]; ++ k)
				if ((i -> first) == s_mat_m_mer_name[k + cnt])
					s2_mat[j][k][s2_mat_n] = 1;
			cnt += s1_mat_m[j];
		}
		++ s2_mat_n;
	}

	index = 0;
	for (auto i = u.begin(); i != u.end(); ++ i) {
		int cnt = 0;
		for (int j = 0; j < org_size; ++ j) {
			s_mat[m_count][cnt + s1_mat_n[j] + index] = 1;
			cnt += s1_mat_n[j] + u.size();
		}
		++ index;
		++ m_count;
	}

	s_mat_m = m_count;

	//debug_print(log);

	log.close();
};

opt_com_nlp :: ~opt_com_nlp() {};

bool opt_com_nlp :: get_nlp_info(Index& n, Index& m, Index& nnz_jac_g,
	Index& nnz_h_lag, IndexStyleEnum& index_style) {

	n = s_mat_n;
	m = s_mat_m;

	nnz_jac_g = s_mat_m * s_mat_n;
	nnz_h_lag = 0;

	index_style = TNLP :: C_STYLE;

	return true;
}

bool opt_com_nlp :: get_bounds_info(Index n, Number* x_l, Number* x_u,
	Index m, Number* g_l, Number* g_u) {

	int cnt = 0;
	for (int i = 0; i < org_size; ++ i) {
		for (int j = 0; j < s1_mat_n[i]; ++ j) {
			x_l[cnt + j] = 0.0;
			x_u[cnt + j] = 2e9;
		}
		cnt += s1_mat_n[i];
		
		for (size_t j = 0; j < feed.size(); ++ j) {
			x_l[cnt + j] = -2e9;
			x_u[cnt + j] = 2e9;
		}
		
		cnt += feed.size();
	}
	
	for (int i = cnt; i < s_mat_n; ++ i) {
		x_l[i] = -2e9;
		x_u[i] = 2e9;
	}

	for (int i = 0; i < s_mat_m_s; ++ i)
		g_l[i] = g_u[i] = 0.0;

	cnt = s_mat_m_s;
	for (int i = 0; i < org_size; ++ i) {
		for (int j = 0; j < s1_mat_n[i]; ++ j) {
			g_l[cnt + j] = 1.0;
			g_u[cnt + j] = 2e9;
		}
		cnt += s1_mat_n[i];
	}

	for (auto i = feed.begin(); i != feed.end(); ++ i) {
		//g_l[cnt] = 0.0; g_u[cnt] = i -> second;
		//g_l[cnt] = i -> second / 2; g_u[cnt] = i -> second;
		g_l[cnt] = g_u[cnt] = - (i -> second);
		//g_l[cnt] = - (i -> second); g_u[cnt] = 0.0;
		++ cnt;
	}

//	cout << "BEGIN G" << endl;
//	for (int i = 0; i < s_mat_m; ++ i)
//		cout << '\t' << g_l[i] << ' ' << g_u[i] << endl;
//	cout << "END G" << endl;

//	cout << "BEGIN X" << endl;
//	for (int i = 0; i < s_mat_n; ++ i)
//		cout << '\t' << x_l[i] << ' ' << x_u[i] << endl;
//	cout << "END X" << endl;

	assert(cnt == (int)s_mat_m);

	return true;
}

bool opt_com_nlp :: get_starting_point(Index n, bool init_x, Number* x,
	bool init_z, Number* z_L, Number* z_U,
	Index m, bool init_lambda,
	Number* lambda) {

	assert(init_z == false);
	assert(init_lambda == false);

	for (int i = 0; i < n; ++ i)
		x[i] = (double)0.0;

	return true;
}

bool opt_com_nlp :: eval_f(Index n, const Number* x,
	bool new_x, Number& obj_value) {

	//cout << "F" << endl;

	Number f = 0.0;

	for (int i = 0; i < s_mat_n_s; ++ i)
		f -= 1.0 * x[i];

	int cnt = 0, cnt2 = s_mat_n_s;
	double inf = 50000.0; //double p = 0.0;

	for (int k = 0; k < org_size; ++ k) {
		double cv = 0.0, pepsiw = 0.0;

		//cout << "CV" << endl;
		for (int i = 0; i < s1_mat_n[k]; ++ i) {
			cv += x[cnt + i];
			//cout << x[cnt + i] << ' ' << cnt + i << endl;
		}
		cnt += s1_mat_n[k];
		
		vector <double> pepsi; pepsi.resize(s1_mat_m[k]);

		//cout << "PEPSI" << endl;
		for (size_t i = 0; i < feed.size(); ++ i) {
			for (int j = 0; j < s2_mat_m[k]; ++ j) if (s2_mat[k][j].count(i))
				pepsi[j] += x[cnt + i] * s2_mat[k][j][i];
			//cout << x[cnt + i] << ' ' << cnt + i << ' ' << endl;
		}
		//cout << endl;

		//cout << "PEPSI" << endl;
		for (int i = 0; i < s1_mat_m[k]; ++ i) {
			pepsiw += pepsi[i] * x[cnt2 + i];
			//cout << pepsi[i] << ' ' << x[cnt2 + i] << ' ' << cnt2 + i << endl;
		}
		//cout << endl;
		
		cnt2 += s1_mat_m[k];
		cnt += feed.size();
		
		f += (cv + pepsiw) * inf;
		//p += (cv + pepsiw);
		//cout << "CV" << cv << ' ' << "PEPSIW" << pepsiw << endl;
	}

	//cout << "STH" << p << endl;

	assert(cnt == s_mat_n_s);
	assert(cnt2 == s_mat_n);

	obj_value = f;

	return true;
}

bool opt_com_nlp :: eval_grad_f(Index n, const Number* x,
	bool new_x, Number* grad_f) {

	//cout << "GRAD_F" << endl;

	for (int i = 0; i < s_mat_n; ++ i)
		grad_f[i] = 0.0;

	double inf = 50000.0;
	for (int i = 0; i < s_mat_n_s; ++ i)
		grad_f[i] = -1.0 ;

	int index = 0;
	for (int k = 0; k < org_size; ++ k) {
		for (int i = 0; i < s1_mat_n[k]; ++ i)
			grad_f[index + i] += inf;
		index += s1_mat_n[k] + feed.size();
	}

	//cout << "GRAD_F2" << endl;

	int cnt = 0, cnt2 = s_mat_n_s;
	for (int k = 0; k < org_size; ++ k) {
		cnt += s1_mat_n[k];
		vector <double> uval, w;

		for (size_t i = 0; i < feed.size(); ++ i)
			uval.push_back(x[cnt + i]);
		for (int i = 0; i < s1_mat_m[k]; ++ i)
			w.push_back(x[cnt2 + i]);

		//cout << "GRAD_F3" << endl;

		for (size_t i = 0; i < feed.size(); ++ i)
			for (int j = 0; j < s1_mat_m[k]; ++ j) if (s2_mat[k][j].count(i))
				grad_f[cnt + i] += inf * w[j] * s2_mat[k][j][i];

		//cout << "GRAD_F4" << endl;

		for (int j = 0; j < s1_mat_m[k]; ++ j)
			for (size_t i = 0; i < feed.size(); ++ i) if(s2_mat[k][j].count(i)) {
				grad_f[cnt2 + j] += inf * s2_mat[k][j][i] * uval[i];
				//cout << "U" << cnt2 + j << ' ' << s2_mat[k][j][i] << ' ' << uval[i] << ' ' << grad_f[cnt2 + j] << endl;
			}

		//cout << "GRAD_F5" << endl;

		cnt += feed.size();
		cnt2 += s1_mat_m[k];
	}

	//cout << "GRAD BEGIN" << endl;
	//for (int i = 0; i < n; ++ i) {
	//	cout << '\t' << grad_f[i] << ' ' << i << endl;
	//}
	//cout << "GRAD END" << endl;

	assert(cnt == s_mat_n_s);
	assert(cnt2 == s_mat_n);

	return true;
}

bool opt_com_nlp :: eval_g(Index n, const Number* x, bool new_x,
	Index m, Number* g) {

	for (int i = 0; i < s_mat_m; ++ i) {
		g[i] = 0.0;
		for (int j = 0; j < s_mat_n; ++ j)
			if (s_mat[i].count(j))
				g[i] += x[j] * s_mat[i][j];
		//cout << g[i] << ' ';
	}
	
	//cout << endl;
	//for (int j = 0; j < s_mat_n; ++ j)
	//	cout << x[j] << ' ';
	//cout << endl;

	return true;
}

bool opt_com_nlp :: eval_jac_g(Index n, const Number* x, bool new_x,
	Index m, Index nele_jac, Index* iRow, Index *jCol,
	Number* values) {

	if (values == NULL) {
		int cnt = 0;
		assert(m == s_mat_m);
		assert(n == s_mat_n);
		for (int i = 0; i < m; ++ i)
			for (int j = 0; j < n; ++ j) {
				iRow[cnt] = i;
				jCol[cnt] = j;
				++ cnt;
			}
		return true;
	}
	
	int cnt = 0;
	for (int i = 0; i < s_mat_m; ++ i) {
		for (int j = 0; j < s_mat_n; ++ j) {
			if (s_mat[i].count(j))
				values[cnt] = 1.0 * s_mat[i][j];
			else values[cnt] = 0.0;
			++ cnt;
		}
	}
	
	//cout << "JAC_G" << endl;
	return true;
}

void opt_com_nlp :: finalize_solution(SolverReturn status,
	Index n, const Number* x, const Number* z_L, const Number* z_U,
	Index m, const Number* g, const Number* lambda,
	Number obj_value,
	const IpoptData* ip_data,
	IpoptCalculatedQuantities* ip_cq) {

	obj = obj_value;
	int cnt = 0, cnt2 = 0;
	for (int k = 0; k < org_size; ++ k) {
		for (int j = 0; j < s1_mat_m[k]; ++ j)
			for (int i = 0; i < s1_mat_n[k]; ++ i) if (s1_mat[k][j].count(i)) {
				ct[s_mat_m_mer_name[cnt2 + j]] -= x[cnt + i] * s1_mat[k][j][i];
				//cout << s_mat_m_mer_name[cnt2 + j] << ' ' << s1_mat[k][j][i] << ' ' << x[cnt + i] << ' ' << cnt + i << '\n';
			}
		cnt += s1_mat_n[k] + feed.size();
		cnt2 += s1_mat_m[k];
	}

	for (auto i = feed.begin(); i != feed.end(); ++ i) {
		ct[i -> first] += i -> second;
	}

	//cout << obj_value << '\n';
	//for (int i = 0; i < n; ++ i)
	//	cout << x[i] << ' ';
	//cout << '\n';

//	for (int i = 0; i < m; ++ i)
//		cout << g[i] << ' ';
//	cout << '\n';

	return;
}
