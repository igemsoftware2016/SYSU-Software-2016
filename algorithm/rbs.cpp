#include <fstream>
#include <string>
#include <vector>
#include <map>
#define MAX_INT 2000000000

using std::endl;
using std::string;

std::vector<int> current, min_series;
std::map<char, std::vector< std::vector<double> > > score_map;
std::map<int, char> pair_map;

const double Gmultiinit = 10.1;
const double Gmultibp = -0.3;

void build_pair_map(){
	pair_map[0] = 'A';
	pair_map[1] = 'G';
	pair_map[2] = 'C';
	pair_map[3] = 'U';
}

void init_data(){
	build_pair_map();
	build_score_map();
}

bool next_series(int length){
	int pointer = 0;
	current[0]++;
	while(current[pointer] == 4){
		current[pointer++] = 0;
		if (pointer == length){
			return false;
		}
		current[pointer]++;
	}
	return true;
}

bool paired(int x, int y){
	return x + y == 3 || x == 1 && y == 3 || x == 3 && y == 1;
}

double min(double x, double y){
	return x > y ? x : y;
}

double Ghairpin(int i, int j){

}

double Ginterior(int i, int d, int e, int j){

}

double Gmulti(int i, int j){

}

double search_struct(int left, int right, char type){
	if (score_map[type][left][right] < MAX_INT - 1) {
		return score_map[type][left][right];
	}
	if (i >= j) {
		score_map[type][left][right] = 0;
		return score_map[type][left][right];
	}
	double min_energy = MAX_INT;
	for (int d = left; d <= right - 1; d++){
		for (int e = d + 1; e <= right; e++){
			if (!paired(current[d], current[e])) continue;
			switch (type) {
				case 'o':
					min_energy = min(min_energy, min(0, search_struct(i, d - 1, 'o') + search_struct(d, e, 'b')));
					break;
				case 'b':
					min_energy = min(min_energy, 
								 min(Ghairpin(i, j), 
								 min(search_struct(d, e, 'b')+ Ginterior(i, d, e, j), 
								 	 search_struct(i + 1, d - 1, 'm') + search_struct(d, e, 'b') + Gmultiinit + 2.0 * Gmultibp + Gmulti(e + 1, j - 1) ) ) );
					break;
				case 'm':
					min_energy = min(min_energy, 
								 min(search_struct(d, e, 'b') + Gmultibp + Gmulti(i, d - 1) + Gmulti(e + 1, j),
								 	 search_struct(i, d - 1, 'm') + search_struct(d, e, 'b') + Gmultibp + Gmulti(e + 1, j) ) );
					break;
			}
		}
	}
	score_map[type][left][right] = min_energy;
	return min_energy;
}

void build_score_map(int length){
	std::vector< std::vector<double> > s;
	s.resize(length);
	for (int i = 0; i < length; i++){
		s[i].resize(length);
		for (int j = 0; j < length; j++){
			s[i][j] = MAX_INT;
		}
	}
	score_map['o'] = s;
	score_map['b'] = s;
	score_map['m'] = s;
}

void clear_score_matrix(int length){
	
}

void RBS(int length){
	double all_min_energy = MAX_INT;
	current.resize(length);
	min_series.resize(length);
	build_score_map(length);
	while(next_series(length)){
		clear_score_matrix(length);
		double current_min_energy = search_struct(0, length - 1, 'o');
		if (all_min_energy > current_min_energy){
			all_min_energy = current_min_energy;
			min_series = current;
		}
	}
}

int main(){
	init_data();
	RBS(15);
	print_data();
}