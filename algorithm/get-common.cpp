#include "get-common.h"

#ifdef memory_check
void current_memory() {
	struct rusage buf;
	int err_code = getrusage(RUSAGE_SELF, &buf);
	cout << "MEMORY CHECK ERROR CODE = " << err_code << endl;
#ifdef MAC
	cout << "MEMORY USED = " << buf.ru_maxrss/ 1024.0 / 1024.0 <<
		" MB\n" << endl;
#endif
#ifdef LINUX
	cout << "MEMORY USED = " << buf.ru_maxrss/ 1024.0 << " MB\n" << endl;
#endif
}
#endif

#include "timer.h"

ifstream fin("data-fake.txt");
ifstream qin("query-fake.txt");
ifstream oin("org-data-fake.txt");
ifstream kin("org-kcat-fake.txt");
ifstream gin("mer-g-fake.txt");

set < string > needed;
map < string, ec_data > ec_map;
map < string, org_data > org_map;
map < string, sub_data > sub_map;
set < std:: pair <string , string > > __unique__;

int edge_counter = 0;

void get_elment(string & s, string & x) {
	if (s.find('\"') == string :: npos) {
		x = "";
		return;
	}

	s.erase(0, s.find('\"') + 1);
	int pos = s.find('\"');	
	x = s.substr(0, pos);
	s.erase(0, pos + 1);
}

void add_ec(string x, string pro_id, string sub_id, string pro_coff,
	string sub_coff) {

	if (0 == ec_map.count(x)) {
		ec_map.insert(make_pair(x, ec_data()));
		ec_map[x].begin = pro_id;
		ec_map[x].end = sub_id;
		ec_map[x].begin_coff = atof(pro_coff.c_str());
		ec_map[x].end_coff = atof(sub_coff.c_str());
	}
}

void add_sub(string x, string name) {
	if (0 == sub_map.count(x))
		sub_map.insert(make_pair(x, sub_data(name)));
}

void add_org(string x) {
	if (0 == org_map.count(x)) {
		org_map.insert(make_pair(x, org_data()));
		org_map[x].name = x;
	}
}

void add_network_edge(string x, string y, string ec) {
	if (0 == __unique__.count(make_pair(x,y))) {
		__unique__.insert(make_pair(x,y));
		sub_map[x].net.push_back(edge(y, ec));
		++ edge_counter;
	}
}

void input() {
#ifdef input_debug
	int input_count = 0;
#endif

#ifdef timer_check
	double total_read_time = 0.0;
	double get_elment_time = 0.0;
	double stl_time = 0.0;
	timer t; t.start();
#endif

	string s; while (getline(fin, s)) {
#ifdef timer_check
		total_read_time += t.stop();
#endif
		string ec_name, sub_id, sub_name, pro_id, pro_name, org_name, sub_coff,
			pro_coff;
		
#ifdef input_debug
		++ input_count;
		if (input_count > 500)
			return;
#endif
#ifdef timer_check
		t.start();
#endif
		get_elment(s, ec_name);
		get_elment(s, sub_id); get_elment(s, sub_name);
		get_elment(s, pro_id); get_elment(s, pro_name);
		get_elment(s, org_name);
		get_elment(s, sub_coff); get_elment(s, pro_coff);

#ifdef timer_check
		get_elment_time += t.stop();
		t.start();
#endif

#ifdef input_debug
		cout << ec_name << ' ' << org_name << ' ' << sub_id << ' '
		<< sub_name << ' ' << pro_id << ' ' << pro_name << endl;
#endif

		add_ec(ec_name, pro_id, sub_id, pro_coff, sub_coff);
		add_sub(sub_id, sub_name);
		add_sub(pro_id, pro_name);
		add_org(org_name);
		
		add_network_edge(pro_id, sub_id, ec_name);

		org_map[org_name].ec_list.insert(ec_name);
		ec_map[ec_name].org_list.insert(org_name);

		sub_map[sub_id].org.insert(org_name);
		sub_map[pro_id].org.insert(org_name);

#ifdef timer_check
		stl_time += t.stop();
		t.start();
#endif
	}
	
#ifdef timer_check
	cout << "READ " << total_read_time << " sec" << endl;
	cout << "STRING " << get_elment_time << " sec\n" << endl;
	cout << "STL " << stl_time << " sec\n" << endl;
#endif
}

#ifdef size_output_debug
void size_output() {
	cout << "EC_SIZE" << ' ' << ec_map.size() << endl;
	cout << "ORG_SIZE" << ' ' << org_map.size() << endl;
	cout << "SUB_SIZE" << ' ' << sub_map.size() << endl;
	cout << "EDGE_COUNTER" << ' ' << edge_counter << endl;
}
#endif

void get_common() {
	map < string, sub_data > :: iterator k;
	for (k = sub_map.begin(); k != sub_map.end(); ++ k) {
		if ( k -> second.org.size() == org_map.size() ) {
			k -> second.circle_flag = true;
		}
	}
}

int sub_size;
vector < string > sub_vec,
	sub_edge_ec;
map < string , int > sub_index;
vector <ec_path_results> sub_res;
int * sub_edge_head, * sub_edge_nxt, * sub_edge_adj;
bool * sub_flag, * sub_inque;

void graph_migrate() {
	sub_size = sub_map.size();

	sub_edge_head = (int *) calloc(sub_size, sizeof(int));
	sub_edge_nxt = (int *) calloc(edge_counter + 10, sizeof(int));
	sub_edge_adj = (int *) calloc(edge_counter + 10, sizeof(int));
	sub_flag = (bool *) calloc(sub_size, sizeof(bool));
	sub_inque = (bool *) calloc(sub_size, sizeof(bool));
	sub_edge_ec.resize(edge_counter + 10);
	sub_vec.resize(sub_size);
	sub_res.resize(sub_size);

	map < string, sub_data > :: iterator k;
	int tmp = 0;

	//
	// mapping names of subs to index
	//

	for (k = sub_map.begin(); k != sub_map.end(); ++ k) {
		sub_vec[tmp] = k -> first;
		sub_flag[tmp] = k -> second.circle_flag;
		sub_index.insert(make_pair(k -> first, tmp));
		++ tmp;
	}

	//
	// construct the graph
	//

	tmp = 1;
	for (k = sub_map.begin(); k != sub_map.end(); ++ k) {
		int x = sub_index[k -> first];
		for (vector <edge> :: iterator i = k -> second.net.begin();
			 i != k -> second.net.end(); ++ i) {
			int y = sub_index[i -> sub];
			sub_edge_nxt[tmp] = sub_edge_head[x];
			sub_edge_ec[tmp] = i -> ec;
			sub_edge_adj[tmp] = y;
			sub_edge_head[x] = tmp;
			++ tmp;
		}
	}
	
#ifdef sub_list
	for (int i = 0; i < sub_size; ++ i) {
		cout << sub_vec[i] << ' ';
		if (0 == i % 10)
			cout << endl;
	}
	cout << endl;
#endif
}

vector <string> current_solution;
map < int, vector < vector <string> > > solution;
map < int, vector <int> > delta_g;

void dfs_res_print(int x, int dep, const int & target) {
	//cout << string(dep, ' ') << sub_vec[x] << endl;
	if (x == target) {
		solution[target].push_back(current_solution);
		return;
	}
	for (set < ec_path_result > :: iterator i =
		sub_res[x].results.begin(); i != sub_res[x].results.end();
		++ i) {

		current_solution.push_back(i -> ec);
		dfs_res_print(i -> from, dep + 1, target);
		current_solution.pop_back();
	}
}

void ec_path_bfs(string x) {
	cout << x << endl;
	if (0 == sub_index.count(x)) {
		cout << "ERROR: IT'S NOT EXIST IN THE DATA." << endl;
		cout << "NO Solution" << endl;
		exit(0);
	}
	cout << sub_map[x].name << endl;
	
	int first = sub_index[x];
	if (sub_flag[first]) {
		cout << "ERROR: IT'S IN THAT CIRCUIT." << endl;
		return;
	}
	
	queue <int> q;
	
	ec_path_result cost(0, first, "");
	sub_res[first].push_result(cost);

	for (q.push(first); q.size(); q.pop()) {
		int x = q.front();
		
		for (int k = sub_edge_head[x]; k ; k = sub_edge_nxt[k]) {
			int y = sub_edge_adj[k];
			ec_path_result cost;
			cost.from = x;
			cost.ec = sub_edge_ec[k];
			
			for (set < ec_path_result > :: iterator i =
				 sub_res[x].results.begin();
				 i != sub_res[x].results.end(); ++ i) {
				cost.depth = (*i).depth + 1;
				
				bool flag = sub_res[y].push_result(cost);

				if (false == sub_inque[y] && false == sub_flag[y] && flag) {
					sub_inque[y] = true;
					q.push(y);
				}
			}
		}
		
		sub_inque[x] = false;
	}

	current_solution.clear();

	for (int x = 0; x < sub_size; ++ x) if (sub_flag[x]) {
		if (sub_res[x].results.empty())
			continue;

		dfs_res_print(x, 0, first);
	}

}

set < set <string> > greedy_match() {
	set <string> basic;
	map <int, bool> mark;
	
	for (auto i = solution.begin(); i != solution.end(); ++ i) {
		if (1 != i -> second.size()) {
			mark.insert(make_pair(i -> first, false)) ;
			continue;
		}
		mark.insert(make_pair(i -> first, true));
		for (auto k = i -> second.at(0).begin();
			k != i -> second.at(0).end(); ++ k)
			basic.insert(* k);
	}

	set <string> more = basic;
	set <string> less = basic;

	for (auto i = solution.begin(); i != solution.end(); ++ i) {
		if (mark[i -> first])
			continue;

		auto res_less = i -> second.end();
		auto res_more = i -> second.end();
		int res_count_less = -1;
		int res_count_more = 99999;

		for (auto j = i -> second.begin(); j != i -> second.end(); ++ j) {
			int count_less = 0;
			int count_more = 0;
			for (auto k = j -> begin(); k != j -> end(); ++ k) {
				if (less.count(* k))
					++ count_less;
				if (more.count(* k))
					++ count_more;
			}

			if (count_less > res_count_less) {
				res_count_less = count_less;
				res_less = j;
			}
			
			if (count_more < res_count_more) {
				res_count_more = count_more;
				res_more = j;
			}
		}

		for (auto k = res_more -> begin(); k != res_more -> end(); ++ k)
			more.insert(* k);
		for (auto k = res_less -> begin(); k != res_less -> end(); ++ k)
			less.insert(* k);
	}

	set < set <string> > ret;
	ret.insert(less);
	ret.insert(more);

	return ret;
}

void bfs_match(set <string> current_solution,
	set < set <string> > & ret) {

	timer t; t.start();
	set < pair < int, set <string> > > visit;
	queue < pair < map < int, vector < vector <string> > > :: iterator, 
		set <string> > > q;

	for (q.push(make_pair(solution.begin(), current_solution));
		q.size(); q.pop()) {

		if (t.stop() > 10.0) {

			visit.clear();
			while(q.size())
				q.pop();

			set < set <string> > part = greedy_match();
			for (auto i = part.begin(); i != part.end(); ++ i)
				ret.insert(*i);

			return;
		}
		auto it = q.front().first;
		auto sol = q.front().second;

		if (it == solution.end()) {
			ret.insert(sol);
			continue;
		}

		auto next = it; ++ next;
		for (size_t i = 0; i < it -> second.size(); ++ i) {
			set <string> next_solution = sol;

			for (auto j = it -> second[i].begin();
				j != it -> second[i].end(); ++ j)
				next_solution.insert(* j);

				int tmp = -1;
				if (next != solution.end())
					tmp = next -> first;

			if (false == visit.count(make_pair(tmp, next_solution))) {
				q.push(make_pair(next, next_solution));
				visit.insert(make_pair(tmp, next_solution));
			}
		}
	}

}

set < set <string> > bfs_match_init() {
	set < set <string> > ret;
	set <string> start;

	bfs_match(start, ret);
	
	return ret;
}

set < set <string> > match() {
	string str; getline(gin, str);
	while (getline(gin, str)) {
		string mer, g_str;
		get_elment(str, mer); get_elment(str, g_str);
		sub_map[mer].g = atof(g_str.c_str());
	}

	for (auto i = solution.begin(); i != solution.end(); ++ i) {
		if (i -> second.size() <= 0) {
			cout << "No Solution" << endl;
			exit(0);
		}

		if (i -> second.size() <= 1)
			continue;

		for (auto j = i -> second.begin(); j != i -> second.end(); ++ j) {
			size_t sol_size = j -> size() - 1;
			double g = sub_map[ec_map[j -> at(0)].end].g;
			double origin_g = sub_map[ec_map[j -> at(sol_size)].begin].g;
			for (int k = (int) sol_size; k >= 0; -- k) {
				g = g / ec_map[j -> at(k)].begin_coff
				* ec_map[j -> at(k)].end_coff;
			}

			delta_g[i -> first].push_back((g - origin_g) / my_abs(g));
		}
	}

	unsigned long long count = 1;
	for (auto i = solution.begin(); i != solution.end(); ++ i) {
		count *= i -> second.size();
		if (count > (1 << 14))
			break;
	}

	if (count > (1 << 14))
		return greedy_match();

	return bfs_match_init();
}

void search() {
	int n; qin >> n;
#ifdef stress_test
	n = sub_size;
#endif
	cout << endl << "INPUT COUNT = " << n << endl;

	for (int i = 0; i < n; ++ i) {
		string sub_id;
#ifndef stress_test
		qin >> sub_id;
#endif
#ifdef stress_test
		sub_id = sub_vec[i];
#endif

		for (int j = 0; j < sub_size; ++ j)
			sub_res[j].clear();

		needed.insert(sub_id);
		ec_path_bfs(sub_id);
	}

	cout << endl;
}

timer dfs_pattern_t;

vector <org_data> pattern_able_org;

void dfs_pattern(int depth, int index, int inserted, set <string> s,
	full_result current, set <full_result> & ret) {

	if (dfs_pattern_t.stop() > 10.0)
		return;

	if (s.empty() && inserted > 0) {
		ret.insert(current);
		return;
	}

	for (size_t i = index; i < pattern_able_org.size(); ++ i) {
		set <string> proc = s;
		set <string> i_ec;

		full_result next_res = current;
		next_res.org_list.insert(pattern_able_org[i].name);

		int counter = 0;

		for (auto j = pattern_able_org[i].ec_list.begin();
			j != pattern_able_org[i].ec_list.end(); ++ j) {
			if (proc.count(* j)) {
				proc.erase(proc.find(* j));
				i_ec.insert(* j);
			}
		}

		bool flag;
		do {
			flag = false;
			set <string> insert_g;

			for (auto j = i_ec.begin(); j != i_ec.end(); ++ j) {
				string mer = ec_map[* j].begin;

				if (false == pattern_able_org[i].t_sub_list.count(mer))
					for (auto k = proc.begin(); k != proc.end(); ++ k) {
						if (ec_map[* k].end ==  mer) {
							insert_g.insert(* k);
							++ counter;
							flag = true;
						}
					}
			}

			for (auto j = insert_g.begin(); j != insert_g.end(); ++ j) {
				proc.erase(proc.find(* j));
				i_ec.insert(* j);
				next_res.insert_gene[pattern_able_org[i].name].insert(* j);
			}

			if (counter > 7)
				break;
		} while (flag);

		if (0 == i_ec.size())
			continue;

		if (counter <= 7)
			dfs_pattern(depth + 1, i + 1, inserted + counter, proc, next_res, ret);
	}
}

set < full_result > dfs_pattern_init(const set <string> & s) {
	set < full_result > ret;
	full_result current;

	for (auto i = org_map.begin(); i != org_map.end(); ++ i)
		if (i -> second.usable)
			pattern_able_org.push_back(i -> second);
			
	sort(pattern_able_org.begin(), pattern_able_org.end());

	dfs_pattern_t.start();

	dfs_pattern(0, 0, 0, s, current, ret);

	return ret;
}

void pattern_org(const set < set <string> > & solution) {

	string str, x;
	getline(oin, str); // useless line;

	getline(oin, str);
	while (get_elment(str, x), x != "") {
		org_map[x].usable = true;
	}

	getline(oin, str); // useless line;

	while (getline(oin, str)) {
		string o, m;
		get_elment(str, o); get_elment(str, m);
		org_map[o].t_sub_list.insert(m);
	}

	getline(kin, str); //useless line;
	while (getline(kin, str)) {
		string o, e, k;
		get_elment(str, o); get_elment(str, e); get_elment(str, k);
		double kcat = atof(k.c_str());
		org_map[o].kcat[e] = kcat;
		org_map[o].sum_kcat += kcat;
		org_map[o].avg_kcat = org_map[o].sum_kcat / org_map[o].kcat.size();
		
		if (kcat > ec_map[e].kcat) {
			ec_map[e].kcat = kcat;
			ec_map[e].kcat_org = o;
		}
	}

	int count = 0;
	for (auto i = solution.begin(); i != solution.end(); ++ i) {
		set < full_result > ans = dfs_pattern_init(* i);
		
		for (auto i = ans.begin(); i != ans.end(); ++ i) {
			cout << "SOLUTION " << (count ++) << endl;
			for (auto j = i -> org_list.begin(); j != i -> org_list.end(); 
				++ j) {
				cout << ' ' << (* j) << endl;
				if (false == i -> insert_gene.count(* j))
					continue;

				cout << ' ';
				for (auto k = i -> insert_gene.at(* j).begin();
					k != i -> insert_gene.at(* j).end(); ++ k) {
					cout << ' ' << (* k) << ":(FROM " << ec_map[* k].kcat_org << ")";
				}
				cout << endl;
			}
			cout << endl;
		}
	}
}

void free_alloc() {
#ifdef memory_check
	current_memory();
#endif
	free(sub_edge_head); sub_edge_head = NULL;
	free(sub_edge_nxt); sub_edge_nxt = NULL;
}

int main() {

	ios :: sync_with_stdio(false);
	
	if (false == fin.is_open() || false == qin.is_open() ||
		false == oin.is_open() || false == kin.is_open() ||
		false == gin.is_open()) {
		cout << "ERROR: Fail to open file" << endl;
		return 0;
	}

	string s;
	getline(fin, s);
	//input the useless line

	input();

#ifdef size_output_debug
	size_output();
#endif

#ifdef timer_check
	timer t; t.start();
#endif

	get_common();
	
#ifdef timer_check
	cout << "GET COMMON " << t.stop() << " sec" << endl;
	t.start();
#endif

	//
	// transform data into c-style structs, for better performance in the
	// search part.
	//

	graph_migrate();

#ifdef timer_check
	cout << "GRAPH " << t.stop() << " sec" << endl;
	t.start();
#endif

	search();

#ifdef timer_check
	cout << "SEARCH " << t.stop() << " sec" << endl;
	t.start();
#endif

	set < set <string> > match_res = match();

#ifdef timer_check
	cout << "MATCH " << t.stop() << " sec" << endl;
	t.start();
#endif

	pattern_org(match_res);

#ifdef timer_check
	cout << "PATTERN ORG " << t.stop() << " sec" << endl;
#endif

	free_alloc();

	return 0;
}
