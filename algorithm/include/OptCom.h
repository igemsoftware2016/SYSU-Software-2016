#ifndef __OPT_COM__
#define __OPT_COM__

#include "IpTNLP.hpp"

#include <set>
#include <map>
#include <vector>
#include <string>
#include <fstream>
#include <utility>
#include <iostream>

using std :: set;
using std :: map;
using std :: endl;
using std :: pair;
using std :: vector;
using std :: string;
using std :: ifstream;
using std :: ofstream;
using std :: make_pair;
using std :: cout;
using std :: to_string;

using namespace Ipopt;

class opt_com_nlp: public TNLP {
public:

	opt_com_nlp(set <string>, map < string, set <string> >, map <string, double>, 
		map <string , double>);

	virtual ~opt_com_nlp();

	virtual bool get_nlp_info(Index& n, Index& m, Index& nnz_jac_g,
		Index& nnz_h_lag, IndexStyleEnum& index_style);

	virtual bool get_bounds_info(Index n, Number* x_l, Number* x_u,
		Index m, Number* g_l, Number* g_u);

	virtual bool get_starting_point(Index n, bool init_x, Number* x,
		bool init_z, Number* z_L, Number* z_U,
		Index m, bool init_lambda,
		Number* lambda);

	virtual bool eval_f(Index n, const Number* x, bool new_x, Number& obj_value);

	virtual bool eval_grad_f(Index n, const Number* x, bool new_x, Number* grad_f);

	virtual bool eval_g(Index n, const Number* x, bool new_x, Index m, Number* g);

	virtual bool eval_jac_g(Index n, const Number* x, bool new_x,
		Index m, Index nele_jac, Index* iRow, Index *jCol,
		Number* values);

/*
	virtual bool eval_h(Index n, const Number* x, bool new_x,
		Number obj_factor, Index m, const Number* lambda,
		bool new_lambda, Index nele_hess, Index* iRow,
		Index* jCol, Number* values);
*/

	virtual void finalize_solution(SolverReturn status,
		Index n, const Number* x, const Number* z_L, const Number* z_U,
		Index m, const Number* g, const Number* lambda,
		Number obj_value,
		const IpoptData* ip_data,
		IpoptCalculatedQuantities* ip_cq);

private:
	map <string, double> feed;

	map < int, map <int, int> > s_mat;
	vector < string > s_mat_n_mer;
	
	int s_mat_m, s_mat_n, s_mat_m_old, s_mat_n_old;

	vector < map < int, map <int, int> > > s1_mat, s2_mat;
	vector < int > s1_mat_n, s2_mat_n, s1_mat_m, s2_mat_m;
	vector < vector <string> > s1_mat_n_mer, s2_mat_n_mer;

	opt_com_nlp(const opt_com_nlp&);
	opt_com_nlp& operator=(const opt_com_nlp&);
};

#endif
