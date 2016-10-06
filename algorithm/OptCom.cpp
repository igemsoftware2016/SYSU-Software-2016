#include "OptCom.h"

using namespace Ipopt;

void opt_com_nlp :: debug_print(ofstream & log) {

	log << s_mat_m << ' ' << s_mat_n << endl;
	for (int i = 0; i < s_mat_m; ++ i) {
		for (int j = 0; j < s_mat_n; ++ j)
			log << s_mat[i][j] << ' ';
		log << endl;
	}

	log << endl;

	for (int i = 0; i < org_size; ++ i) {
		log << i << ' ' << s1_mat_m[i] << ' ' << s1_mat_n[i] << endl;
		for (int x = 0; x < s1_mat_m[i]; ++ x) {
			for (int y = 0; y < s1_mat_n[i]; ++ y)
				log << s1_mat[i][x][y] << ' ';
			log << endl;
		}
	}

	for (int i = 0; i < org_size; ++ i) {
		log << i << ' ' << s2_mat_m[i] << ' ' << s2_mat_n[i] << endl;
		for (int x = 0; x < s2_mat_m[i]; ++ x) {
			for (int y = 0; y < s2_mat_n[i]; ++ y)
				log << s2_mat[i][x][y] << ' ';
			log << endl;
		}
	}
	
	assert(s_mat_n_c.size() == s_mat_n_mer_name.size());
	assert((int)s_mat_n_c.size() == s_mat_n_s);
	for (int i = 0; i < org_size; ++ i) {
		log << s1_mat_m[i] << ' ' << s2_mat_m[i] << endl;
		assert(s1_mat_m[i] == s2_mat_m[i]);
	}

	for (size_t i = 0; i < s_mat_n_c.size(); ++ i)
		if (s_mat_n_c[i] > 0.0)
			log << s_mat_n_c[i] << ' ' << s_mat_n_mer_name[i] << endl;;
}

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
		
		//bool flag1, flag2;
		//cout << "ORG" << index << ' ' << ec_count << endl;
		for (int ec_idx = 0; ec_idx < ec_count; ++ ec_idx) {
			string ec_name; int mer_size;
			org >> ec_name >> mer_size;

			set <string> s_list;
			
			//flag1 = flag2 = false;

			for (int j = 0; j < mer_size; ++ j) {
				string mer_name; org >> mer_name;

				if (0 == s_mer_to_index.count(mer_name)) {
					s_mer_to_index.insert(make_pair(mer_name, n_count ++));
					s_mat_n_mer_name.push_back(mer_name);
					s_mat_n_mer_cnt.push_back(0);
					if (c.count(mer_name))
						s_mat_n_c.push_back(c[mer_name]);
					else
						s_mat_n_c.push_back(0);
					s_mat_n_mer.push_back(to_string(index) + mer_name);
				}

				s_list.insert(mer_name);
			}

			for (auto j = s_list.begin(); j != s_list.end(); ++ j) {
				int x; org >> x;
				s_mat[m_count][s_mer_to_index[* j]] = x;
				s_mat_n_mer_cnt[s_mer_to_index[* j]] += x;

				if (u.count(* j)) {
					//flag2 = true; //cout << 2 << ' ' << index << endl;
					if (0 == s2_mer_to_index.count(* j)) {
						s2_mer_to_index.insert(make_pair(* j, s2_mat_n[index] ++));
						s2_mat_n_mer[index].push_back(*j);
					}
					s2n[s2_mat_m[index]][s2_mer_to_index[* j]] = x;
				}
				else {
					//flag1 = true; //cout << 1 << ' ' << index << endl;
					if (0 == s1_mer_to_index.count(* j)) {
						s1_mer_to_index.insert(make_pair(* j, s1_mat_n[index] ++));
						s1_mat_n_mer[index].push_back(*j);
					}
					s1n[s1_mat_m[index]][s1_mer_to_index[* j]] = x;
				}
			}

			//if (flag1)
				++ s1_mat_m[index];
			//if (flag2)
				++ s2_mat_m[index];

			++ m_count;
		}

		org.close();

		for (auto ec_idx = ins[*i].begin(); ec_idx != ins[*i].end(); ++ ec_idx) {
			string ec_name = * ec_idx;
			//flag1 = flag2 = false;

			for (auto k = ec_list[ec_name].begin(); k != ec_list[ec_name].end(); ++ k) {
				string mer_name = k -> first;
				if (0 == s_mer_to_index.count(mer_name)) {
					s_mer_to_index.insert(make_pair(mer_name, n_count ++));
					s_mat_n_mer_name.push_back(mer_name);
					s_mat_n_mer_cnt.push_back(0);
					if (c.count(mer_name))
						s_mat_n_c.push_back(c[mer_name]);
					else
						s_mat_n_c.push_back(0);
					s_mat_n_mer.push_back(to_string(index) + mer_name);
				}
				s_mat[m_count][s_mer_to_index[mer_name]] = k -> second;
				s_mat_n_mer_cnt[s_mer_to_index[mer_name]] += k -> second;
				
				if (u.count(mer_name)) {
					//flag2 = true;
					if (0 == s2_mer_to_index.count(mer_name)) {
						s2_mer_to_index.insert(make_pair(mer_name, s2_mat_n[index] ++));
						s2_mat_n_mer[index].push_back(mer_name);
					}
					s2n[s2_mat_m[index]][s2_mer_to_index[mer_name]] = k -> second;
				}
				else {
					//flag1 = true;
					if (0 == s1_mer_to_index.count(mer_name)) {
						s1_mer_to_index.insert(make_pair(mer_name, s1_mat_n[index] ++));
						s1_mat_n_mer[index].push_back(mer_name);
					}
					s1n[s1_mat_m[index]][s1_mer_to_index[mer_name]] = k -> second;
				}
			}
			
			//if (flag1)
				++ s1_mat_m[index];
			//if (flag2)
				++ s2_mat_m[index];

			++ m_count;
		}
		s1_mat.push_back(s1n);
		s2_mat.push_back(s2n);
		++ index;
	}

	s_mat_n = s_mat_n_s = n_count;
	s_mat_m = s_mat_m_s = m_count;

	for (size_t i = 0; i < orgs.size(); ++ i) {
		for (auto row = s1_mat[i].begin(); row != s1_mat[i].end(); ++ row) {
			for (auto col = row -> second.begin(); col != row -> second.end(); ++ col) {
				s_mat[col -> first + s_mat_m][row -> first + s_mat_n] = col -> second;
			}
		}
		s_mat_m += s1_mat_n[i];
		s_mat_n += s1_mat_m[i];
	}

	s_mat_m_s1 = s_mat_m;
	s_mat_n_s1 = s_mat_n;

	for (auto k = u.begin(); k != u.end(); ++ k) {
		for (size_t i = 0; i < s_mat_n_mer_name.size(); ++ i)
			if (s_mat_n_mer_name[i] == k -> first) {
				//assert(s_mat_n_mer_cnt[i] != 0);
				if (s_mat_n_mer_cnt[i] == 0)
					continue;
				if (s_mat_n_mer_cnt[i] > 0)
					s_mat[s_mat_m][i] = 1;
				else
					s_mat[s_mat_m][i] = -1;
			}
		++ s_mat_m;
	}

	debug_print(log);

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

	for (int i = 0; i < s_mat_n_s; ++ i) {
		x_l[i] = 0.0; x_u[i] = 2e19;
	}

//	for (int i = 0; i < s_mat_n_s; ++ i) {
//		if (s_mat_n_c[i] > 0.0)
//			x_l[i] = 0.5;
//	}

	for (int i = s_mat_n_s; i < s_mat_n; ++ i) {
		x_l[i] = -2e19; x_u[i] = 2e19;
	}

	for (int i = 0; i < s_mat_m_s; ++ i)
		g_l[i] = g_u[i] = 0.0;

	for (int i = s_mat_m_s; i < s_mat_m_s1; ++ i) {
		g_u[i] = 2e19; g_l[i] = 1.0; // lower-C
	}

	//cout << s_mat_m_s << ' ' << s_mat_m_s1 << '\n';

	auto k = feed.begin();
	for (int i = s_mat_m_s1; i < s_mat_m; ++ i) {
		g_l[i] = (k -> second) / 2.0 ; g_u[i] = (k -> second);
		//cout << g_l[i] << ' ';
		++ k;
	}
	//cout << '\n';

//	for (size_t i = 0; i < s_mat_n_c.size(); ++ i)
//		cout << s_mat_n_c[i] << ' ';
	return true;
}

bool opt_com_nlp :: get_starting_point(Index n, bool init_x, Number* x,
	bool init_z, Number* z_L, Number* z_U,
	Index m, bool init_lambda,
	Number* lambda) {

//	assert(init_x == false);
	assert(init_z == false);
	assert(init_lambda == false);

	for (int i = 0; i < n; ++ i) {
		x[i] = 0.0;
	}

//	x[0] = 1; x[1] = x[2] = x[3] = x[4] = x[5] = 2;
//	x[6] = x[7] = x[8] = x[10] = 0;

//	int index = 0;
//	for (auto i = feed.begin(); i != feed.end(); ++ i) {
//		if (i -> second != 0) {
//			int pos = s_mat_m_s1 + index;
//			for (auto j = s_mat[pos].begin(); j != s_mat[pos].end(); ++ j) {
//				if (x[j -> first] == 0) {
//					x[j -> first] = j -> second;
//					break;
//				}
//			}
//		}
//		++ index;
//	}

//	ifstream din("EXsolution.txt");
//	for (int i = 0; i < n; ++ i)
//		din >> x[i];
//	din.close();

	return true;
}

bool opt_com_nlp :: eval_f(Index n, const Number* x,
	bool new_x, Number& obj_value) {
	Number f = 0.0;

	for (size_t i = 0; i < s_mat_n_c.size(); ++ i)
		f -= 1.0 * s_mat_n_c[i] * x[i];

	double inf = 500; double cv = 0.0;

	for (int i = 0; i < s_mat_n_s; ++ i)
		if (false == feed.count(s_mat_n_mer_name[i]))
			cv += x[i]; // lower-C

	double pepsiw = 0.0;
	int cnt = 0; int foobar = s_mat_n_s;
	for (int i = 0; i < org_size; ++ i) {
		vector <double> u;
		for (int j = 0; j < s1_mat_n[i] + s2_mat_n[i]; ++ j)
			if (feed.count(s_mat_n_mer_name[j + cnt]))
				u.push_back(x[j + cnt]);
				
		assert((int)u.size() == s2_mat_n[i]);

		vector <double> pepsi; pepsi.resize(s2_mat_m[i]);

		for (int x = 0; x < s2_mat_m[i]; ++ x) //if (s2_mat[i].count(x))
			for (int y = 0; y < s2_mat_n[i]; ++ y) if (s2_mat[i][x].count(y))
				pepsi[x] -= s2_mat[i][x][y] * u[y];
		
		for (int j = 0; j < s2_mat_m[i]; ++ j) {
			pepsiw += pepsi[j] * x[foobar + j];
			//cout << pepsi[j] << ' ' << x[foobar + j] << '\n';
		}
 
 		foobar += s2_mat_m[i];
		cnt += s1_mat_n[i] + s2_mat_n[i];
	}

	assert(cnt == s_mat_n_s);
	assert(foobar == s_mat_n);

	f += (cv - pepsiw) * inf;

	//cout << "CV" << cv << " PEPSI" << pepsiw << " F" << f << '\n';

	obj_value = f;

	return true;
}

bool opt_com_nlp :: eval_grad_f(Index n, const Number* x,
	bool new_x, Number* grad_f) {

//	cout << "WOW \n";
	for (int i = 0; i < s_mat_n_s; ++ i) {
		grad_f[i] = -s_mat_n_c[i];
		//cout << grad_f[i] << ' ';
	}
	for (int i = s_mat_n_s; i < s_mat_n; ++ i) {
		grad_f[i] = 0;
		//cout << grad_f[i] << ' ';
	}
//	cout << '\n';

	int cnt = 0; int foobar = s_mat_n_s; double inf = 500;
	for (int i = 0; i < org_size; ++ i) {
		int index = 0;

		vector <double> U;

		for (int j = 0; j < s1_mat_n[i] + s2_mat_n[i]; ++ j)
			if (feed.count(s_mat_n_mer_name[j + cnt])) {
				U.push_back(x[j + foobar]);
				vector <double> u;
				for (int k = 0; k < s2_mat_m[i]; ++ k)
					if (s2_mat[i][index].count(k))
						u.push_back(s2_mat[i][index][k]);
					else u.push_back(0);
				
				for (int k = 0; k < s2_mat_m[i]; ++ k)
					grad_f[cnt + j] -= inf * u[k] * x[k + foobar];
				
				++ index;
			} else grad_f[cnt + j] += 1.0; // lower-C

		assert(index == (int)U.size());
		assert(index == s2_mat_n[i]);

		for (int j = 0; j < s2_mat_m[i]; ++ j) {
			for (int k = 0; k < s2_mat_n[i]; ++ k)
				if (s2_mat[i][j].count(k))
					grad_f[foobar + j] += inf * s2_mat[i][j][k] * U[k];
		}

		foobar += s2_mat_m[i];
		cnt += s1_mat_n[i] + s2_mat_n[i];
	}

	assert(foobar == s_mat_n);
	assert(cnt == s_mat_n_s);

//	for (int i = 0; i < s_mat_n; ++ i)
//		grad_f[i] *= -1.0;

	return true;
}

bool opt_com_nlp :: eval_g(Index n, const Number* x, bool new_x,
	Index m, Number* g) {

	for (int i = 0; i < s_mat_m; ++ i) {
		g[i] = 0.0;
		for (int j = 0; j < s_mat_n; ++ j)
			if (s_mat[i].count(j))
				g[i] += x[j] * s_mat[i][j];
	}

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
				values[cnt] = s_mat[i][j];
			else values[cnt] = 0;
			++ cnt;
			//cout << values[cnt - 1] << ' ';
		}
		//cout << '\n';
	}

	return true;
}

//bool opt_com_nlp :: eval_h(Index n, const Number* x, bool new_x,
//	Number obj_factor, Index m, const Number* lambda,
//	bool new_lambda, Index nele_hess, Index* iRow,
//	Index* jCol, Number* values) {
//	return true;
//}

void opt_com_nlp :: finalize_solution(SolverReturn status,
	Index n, const Number* x, const Number* z_L, const Number* z_U,
	Index m, const Number* g, const Number* lambda,
	Number obj_value,
	const IpoptData* ip_data,
	IpoptCalculatedQuantities* ip_cq) {

	for (int i = 0; i < s_mat_n_s ; ++ i) if (feed.count(s_mat_n_mer_name[i]))
		cout << x[i] << ' ' << s_mat_n_mer_name[i] << '\n';

	double f = 0.0;
	for (int i = 0; i < s_mat_n_s ; ++ i)
		f += x[i] * s_mat_n_c[i];

	cout << '\n' << f << '\n' << -((-obj_value) - f) << '\n';
}
