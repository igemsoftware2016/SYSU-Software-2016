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

#ifdef timer_check

#include "timer.h"

#endif

ifstream fin("data-fake.txt");
ifstream qin("query-fake.txt");

map < string, ec_data > ec_map;
map < string, org_data > org_map;
map < string, sub_data > sub_map;
set < std:: pair <string , string > > __unique__;

int edge_counter = 0;

void get_elment(string & s, string & x) {
	s.erase(0, s.find('\"') + 1);
	int pos = s.find('\"');
	x = s.substr(0, pos);
	s.erase(0, pos + 1);
}

void add_ec(string x) {
	if (0 == ec_map.count(x))
		ec_map.insert(make_pair(x, ec_data()));
}

void add_sub(string x, string name) {
	if (0 == sub_map.count(x))
		sub_map.insert(make_pair(x, sub_data(name)));
}

void add_org(string x) {
	if (0 == org_map.count(x))
		org_map.insert(make_pair(x, org_data()));
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
		string ec_name, sub_id, sub_name, pro_id, pro_name, org_name;
		
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

#ifdef timer_check
		get_elment_time += t.stop();
		t.start();
#endif

#ifdef input_debug
		cout << ec_name << ' ' << org_name << ' ' << sub_id << ' '
		<< sub_name << ' ' << pro_id << ' ' << pro_name << endl;
#endif

		add_ec(ec_name);
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
		//if (sub_flag[tmp])
		//	cout << "FLAG " << sub_vec[tmp] << endl;
		++ tmp;
	}

	//
	// construct the graph
	//
	
	//cout << sub_vec[575] << ' ' << sub_vec[1452] << endl;

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
vector < vector <string> > solution;

void mark_solution() {
	solution.push_back(current_solution);
}

void dfs_res_print(int x, int dep, const int & target) {
	if (x == target) {
		mark_solution();
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
		return;
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

	solution.clear();
	current_solution.clear();

	for (int x = 0; x < sub_size; ++ x) if (sub_flag[x]) {
		if (sub_res[x].results.empty())
			continue;

		dfs_res_print(x, 0, first);
	}

}

void match() {
	cout << solution.size() << " ec-solution(s) FOUND" << endl;
	for (auto i = solution.begin(); i != solution.end(); ++ i) {
		for (auto j = i -> begin(); j != i -> end(); ++ j)
			cout << (* j) << ' ';
		cout << endl;
	}
	
	
}

void search() {
	int n; qin >> n;
#ifdef stress_test
	n = sub_size;
#endif
	cout << endl << "INPUT COUNT = " << n << endl;

	for (int i = 0; i < n; ++ i) {
		string sub_id;
		qin >> sub_id;
#ifdef stress_test
		sub_id = sub_vec[i];
#endif

		for (int j = 0; j < sub_size; ++ j)
			sub_res[j].clear();
		
		ec_path_bfs(sub_id);
		match();
	}

	cout << endl;
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
	
	if (false == fin.is_open() || false == qin.is_open()) {
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
#endif

	free_alloc();

	return 0;
}
