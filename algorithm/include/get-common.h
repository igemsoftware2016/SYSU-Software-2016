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

using std :: string;
using std :: cout;
using std :: endl;
using std :: queue;
using std :: set;
using std :: map;
using std :: vector;
using std :: ifstream;
using std :: ios;

//#define input_debug
//#define size_output_debug
#define timer_check
//#define LINUX
//#define WINDOWS
//#define sub_list
//#define stress_test
#define MAC

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
	std :: string ec;
	//
	// how to achieve, the name of that ec
	//
	std :: string sub;
	//
	// where if from, the name of substrate
	//
	edge(std :: string _sub, std :: string _ec) {
		ec = _ec; sub = _sub;
	}
};

struct sub_data {
	std :: vector <edge> net;
	std :: set <std :: string> org;
	std :: string name;
	
	bool circle_flag;
	
	sub_data(std :: string _name) {
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

struct org_data{
	std :: set < std :: string> ec_list;
	//
	// list of ecs, that org got.
	//
};

struct ec_data{
	std :: set < std :: string> org_list;
	//
	// orgs that have this ec.
	//
};

struct ec_path_result {
	int depth, from;
	std :: string ec;
	ec_path_result() {}
	ec_path_result(int _depth, int _from, std :: string _ec) {
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
	std :: set < ec_path_result > results;
	bool push_result(ec_path_result x) {
		std :: set < ec_path_result > :: iterator k;

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
			std :: set < ec_path_result > :: iterator k = results.end();
			results.erase(-- k);
		}
	}
};

#endif
