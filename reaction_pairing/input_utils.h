#ifndef __INPUT_UTILS__
#define __INPUT_UTILS__

#include <set>
#include <map>
#include <string>
#include <vector>
#include <fstream>
#include <iostream>
#include <sstream>
#include <utility>

namespace mol {

using std :: set;
using std :: endl;
using std :: ofstream;
using std :: ifstream;
using std :: map;
using std :: vector;
using std :: string;
using std :: stringstream;
using std :: make_pair;

class substance {
public:
	map <string, int> atom;
	string name, ID;
	substance();
	~substance();
	void clear();
private:
	// no ptr used, same as deep copy
	//substance(const substance&);
	substance& operator = (const substance&);
};

class reaction {
public:
	map <string, int> sub, pdt;
	string ec_name;

	reaction();
	~reaction();
	void clear();
private:
	// no ptr used, same as deep copy
	//reaction(const reaction&);
	reaction& operator = (const reaction&);
};

class mol_file {
public:
	mol_file();
	~mol_file();
private:
	mol_file(const mol_file&);
	mol_file& operator = (const mol_file&);
};

int to_int(string x);
bool drop_test(string x);
string get_element(string str, string x);
bool check_element(string str, string x);
string first_useful(ifstream & fin);
bool input_initial(vector <reaction>&, map <string, substance>&);

};

#endif
