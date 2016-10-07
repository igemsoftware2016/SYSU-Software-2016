#ifndef __GET_COMMON__
#define __GET_COMMON__

#include <string>
#include <vector>
#include <fstream>
#include <iostream>
#include <map>
#include <set>
#include <utility>
#include <sstream>
#include <queue>
#include <algorithm>

using std :: string;
using std :: cout;
using std :: endl;
using std :: queue;
using std :: set;
using std :: map;
using std :: vector;
using std :: ifstream;
using std :: ios;
using std :: make_pair;
using std :: pair;
using std :: sort;

//#define input_debug
#define size_output_debug
#define timer_check
#define LINUX
//#define WINDOWS
//#define sub_list
//#define stress_test
//#define MAC

#ifndef WINDOWS
//
// Base on a linux/unix api. So I'm not going to
// test the memory on windows.
//
#define memory_check
#endif

#ifdef memory_check
#include <sys/resource.h>
#endif

struct edge {
	string ec;
	//
	// how to achieve, the name of that ec
	//
	string sub;
	//
	// where if from, the name of substrate
	//
	edge(string _sub, string _ec) {
		ec = _ec; sub = _sub;
	}
};

struct sub_data {
	vector <edge> net;
	set <string> org;
	string name;

	double g;

	bool circle_flag;
	
	sub_data(string _name) {
		name = _name;
		circle_flag = false;
	}
	
	sub_data() {circle_flag = false;}
	//
	// every substance is a node of the whole network, the edges are the ecs
	// that counld produce it. The network is the oppsite of the reaction
	// chains.
	//
};

inline double my_abs(double x) {
	return (x > 0.0) ? (x) : (-x);
}

struct org_data{
	set < string> ec_list;
	set < string > t_sub_list;
	map < string, double > kcat;
	string name;
	bool usable;
	double avg_kcat, sum_kcat;

	org_data() {usable = false;}
	
	bool operator < (const org_data & b) const {
		if (ec_list.size() != b.ec_list.size())
			return ec_list.size() > b.ec_list.size();

		if (my_abs(avg_kcat - b.avg_kcat) > 1e-4)
			return avg_kcat > b.avg_kcat;

		return t_sub_list.size() < b.t_sub_list.size();
	}

	//
	// list of ecs, that org got.
	//
};

struct ec_data{
	set < string > org_list;
	string begin, end, kcat_org;
	double kcat, begin_coff, end_coff;
	
	ec_data() {kcat = -99999;}
	//
	// orgs that have this ec.
	//
};

struct ec_path_result {
	int depth, from;
	string ec;
	ec_path_result() {}
	ec_path_result(int _depth, int _from, string _ec) {
		depth = _depth;
		from = _from;
		ec = _ec;
	}
	bool operator < (const ec_path_result & b) const {
		if (depth != b.depth)
			return depth < b.depth;
		if (from != b.from)
			return from < b.from;
		return false;
	}
};

struct ec_path_results {
	set < ec_path_result > results;
	bool push_result(ec_path_result x) {
		set < ec_path_result > :: iterator k;

		if (results.size() > 0) {
			k = results.end();
			-- k;
		
			if ((*k).depth <= x.depth)
				return false;
		}

		results.insert(x);
		
		if (results.size() > 5) {
			k = results.end();
			-- k;
			results.erase(k);
		}

		return true;
	}
	void clear() {
		while (false == results.empty()) {
			set < ec_path_result > :: iterator k = results.end();
			results.erase(-- k);
		}
	}
};

struct full_result {
	set < string > org_list;
	map < string, set <string> > insert_gene;
	
	bool operator < (const full_result & b) const {
		if (org_list != b.org_list)
			return org_list < b.org_list;
		if (insert_gene != b.insert_gene)
			return insert_gene < b.insert_gene;
		return false;
	}
	
	~full_result() {
		org_list.clear();
		insert_gene.clear();
	}
};

#endif
