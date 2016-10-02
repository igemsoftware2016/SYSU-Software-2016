#include "input_utils.h"

#include <algorithm>

using std :: min;
using std :: max;
using std :: sort;

using namespace mol;

const int inf = 1 << 30;

int sqr(int x) {
	return x * x;
}

int get_score(map <string, substance> & substance_list,
	string sub_name, int sub_coeff,
	string pdt_name, int pdt_coeff) {
	
	if (false == substance_list.count(pdt_name))
		return inf;
	if (false == substance_list.count(sub_name))
		return inf;

	map <string, int> atom_diff;
	for (auto i = substance_list[pdt_name].atom.begin();
		i != substance_list[pdt_name].atom.end(); ++ i)
		atom_diff.insert(make_pair(i -> first, pdt_coeff * (i -> second)));

	for (auto i = substance_list[sub_name].atom.begin();
		i != substance_list[sub_name].atom.end(); ++ i)
		atom_diff[i -> first] -= sub_coeff * (i -> second);

	int res = 0;
	for(auto i = atom_diff.begin(); i != atom_diff.end(); ++ i)
		res += sqr(i -> second);
	return res;
}

int main() {

	vector <reaction> reaction_list;
	map <string, substance> substance_list;

	if(false == input_initial(reaction_list, substance_list))
		return 1;

	ofstream res("pairing_result.txt");
	ofstream log("log.txt");

	int ord_size, inord_size;
	ord_size = inord_size = 0;

	for (auto i = reaction_list.begin(); i != reaction_list.end(); ++ i) {
		int sub_size = i -> sub.size();
		int pdt_size = i -> pdt.size();

		ord_size += (sub_size == pdt_size);
		inord_size += (sub_size != pdt_size);
		
		log << ord_size + inord_size << endl;

		vector <int> score; score.resize(sub_size * pdt_size);

		int sub_index = 0, pdt_index;
		for (auto j = i -> sub.begin(); j != i -> sub.end(); ++ j) {
			pdt_index = 0;
			for (auto k = i -> pdt.begin(); k != i -> pdt.end(); ++ k) {
				score[sub_index * pdt_size + pdt_index] =
					get_score(substance_list, j -> first, j -> second,
						k -> first, k -> second);
				
				//log << score[sub_index * pdt_size + pdt_index] << ' ';
				
				++ pdt_index;
			}
			++ sub_index;
			//log << endl;
		}

		vector <int> tot = score;
		sort(tot.begin(), tot.end());

		log << tot.size() << endl;
		int limit = tot.size() - 1;
		while (limit > 0 && inf == tot[limit])
			-- limit;
		log << '\t' << 1 << limit << endl;

		if (limit >= max(sub_size, pdt_size))
			limit = min(sub_size * pdt_size - max(sub_size, pdt_size), limit);

		limit = max(limit, 0);
		log << '\t' << 2 << limit << endl;

		if ((int)tot.size() > limit)
			limit = tot[limit];
		else limit = 0;

		log << '\t' << 3 << limit << endl;
		if (inf == limit)
			limit --;
		log << '\t' << 4 << limit << endl;

		sub_index = 0;
		for (auto j = i -> sub.begin(); j != i -> sub.end(); ++ j) {
			pdt_index = 0;
			for (auto k = i -> pdt.begin(); k != i -> pdt.end(); ++ k) {
				if (score[sub_index * pdt_size + pdt_index] <= limit)
					res << '\"' << i -> ec_name << "\"\t" <<
						'\"' << ((substance_list[j -> first].ID == "") ? (substance_list[j -> first].name) : (substance_list[j -> first].ID)) << "\"\t" <<
						'\"' << substance_list[j -> first].name << "\"\t" <<
						'\"' << ((substance_list[k -> first].ID == "") ? (substance_list[k -> first].name) : (substance_list[k -> first].ID)) << "\"\t" <<
						'\"' << substance_list[k -> first].name << "\"\t" <<
						'\"' << j -> second << "\"\t\"" << k -> second << '\"' << endl;

				++ pdt_index;
			}
			++ sub_index;
		}
		log << endl;
	}

	log << ord_size << ' ' << inord_size << endl;
	log.close();
	res.close();
	
	return 0;
}

