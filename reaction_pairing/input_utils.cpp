#include "input_utils.h"

namespace mol {

substance :: substance() {
}

substance :: ~substance() {
}

reaction :: reaction() {
}

reaction :: ~reaction() {
}

mol_file :: mol_file() {
}

mol_file :: ~mol_file() {
}

void substance :: clear() {
	atom.clear(); name = ""; ID="";
}

int to_int(string x) {
	stringstream sin(x);
	int res; sin >> res;
	return res;
}

string get_element(string str, string x) {
	stringstream sin(str); string s;
	sin >> s; sin >> s; sin >> s;
	return s;
}

bool check_element(string str, string x) {
	for (size_t i = 0; i < x.size(); ++ i)
		if (str[i] != x[i])
			return false;
	return true;
}

bool drop_test(string x) {
	set <char> forbid_list;

	for (char i = 'a'; i <= 'z'; ++ i)
		forbid_list.insert(i);
	forbid_list.insert('|');

	for (size_t i = 0; i < x.size(); ++ i)
		if (forbid_list.count(x[i]))
			return true;

	return false;
}

void reaction :: clear() {
	sub.clear(); pdt.clear();
	ec_name = "";
}

string first_useful(ifstream & fin) {
	string str;
	do {getline(fin, str);} while ('#' == str[0]);
	return str;
}

bool input_initial(vector <reaction>& reaction_list,
	map <string, substance>& substance_list) {
	
	map <string, int> ec_check;

	ifstream react("reactions.dat");
	ifstream comp("compounds.dat");
	ofstream log("log.txt");

	if (false == react.is_open() || false == comp.is_open() ||
		false == log.is_open())
		return false;

	string str, dir, name;
	substance current_subs;

	str = first_useful(comp);
	do {
		if (check_element(str, "UNIQUE-ID"))
			current_subs.name = get_element(str, "UNIQUE-ID");
		if (check_element(str, "CHEMICAL-FORMULA")) {
			size_t pos = str.find('(');
			string n_str(str, pos + 1);
			stringstream sin(n_str);
			string atom_name; int atom_count;
			sin >> atom_name >> atom_count;
			//log << atom_name << ' ' << atom_count << endl;
			current_subs.atom.insert(make_pair(atom_name, atom_count));
		}

		if (check_element(str, "DBLINKS - (LIGAND-CPD \"")) {
			size_t pos = str.find('\"');
			string n_str(str, pos + 1);
			stringstream sin(n_str);
			sin >> current_subs.ID;
			current_subs.ID.pop_back();
		}

		if ("//" == str) {
			if (substance_list.count(current_subs.name))
				log << "ERROR " << current_subs.name << endl;
			if (current_subs.name == "")
				log << "ERROR EMPTY C" << endl;
			substance_list.insert(make_pair(current_subs.name, current_subs));
			current_subs.clear();
		}
	} while (getline(comp, str));

	str = first_useful(react);
	bool flag_drop = false;
	reaction current_react;

	do {
		if (check_element(str, "EC-NUMBER"))
			current_react.ec_name = get_element(str, "EC-NUMBER");
		if (check_element(str , "REACTION-DIRECTION"))
			dir = get_element(str, "REACTION-DIRECTION");
		if (check_element(str, "UNIQUE-ID")) {
			if (check_element(get_element(str, "UNIQUE-ID"), "TRANS-"))
				flag_drop = true;
			if (current_react.ec_name != "")
				continue;
			current_react.ec_name = get_element(str, "UNIQUE-ID");
		}

		if (check_element(str , "LEFT")) {
			name = get_element(str, "LEFT");
			flag_drop |= drop_test(name);
			if (false == flag_drop && false == substance_list.count(name))
				log << "ERROR " << name << endl;
			current_react.sub[name] = 1;
		}

		if (check_element(str , "RIGHT")) {
			name = get_element(str, "RIGHT");
			flag_drop |= drop_test(name);
			if (false == flag_drop && false == substance_list.count(name))
				log << "ERROR " << name << endl;
			current_react.pdt[name] = 1;
		}

		if (check_element(str , "^COEFFICIENT")) {
			int coeff = to_int(get_element(str, "^COEFFICIENT"));
			current_react.sub[name] = coeff;
		}

		if ("//" == str) {
			if (flag_drop) {
				flag_drop = false;
				current_react.clear();
				continue;
			}

			string ec_name = current_react.ec_name;
			
			string p_num = "_pum_" + std :: to_string(ec_check[ec_name] ++);
			
			if ("REVERSIBLE" == dir || "LEFT-TO-RIGHT" == dir) {
				current_react.ec_name = ec_name + "_0" + p_num;
				reaction_list.push_back(current_react);
			}
			swap(current_react.sub, current_react.pdt);
			if ("REVERSIBLE" == dir || "RIGHT-TO-LEFT" == dir) {
				current_react.ec_name = ec_name + "_1" + p_num;
				reaction_list.push_back(current_react);
			}

			current_react.clear();
		}
	} while (getline(react, str));
	
	react.close();
	comp.close();

	log << reaction_list.size() << endl;
	for (size_t i = 0; i < reaction_list.size(); ++ i) {
		log << reaction_list[i].ec_name << endl;
		for (auto j = reaction_list[i].sub.begin();
			j != reaction_list[i].sub.end(); ++ j)
			log << "    SUB " << j -> first << ' ' << j -> second << endl;
		for (auto j = reaction_list[i].pdt.begin();
			j != reaction_list[i].pdt.end(); ++ j)
			log << "    PDT " << j -> first << ' ' << j -> second << endl;
	}

	log << substance_list.size() << endl;
	for (auto i = substance_list.begin(); i != substance_list.end(); ++ i) {
		log << (i -> second.name) << '|' << (i -> second.ID) << endl;
		for (auto j = i -> second.atom.begin(); j != i -> second.atom.end(); ++ j)
			log << "    ATOM " << j -> first << ' ' << j -> second << endl;
	}

	log.close();

	return true;
}

};

