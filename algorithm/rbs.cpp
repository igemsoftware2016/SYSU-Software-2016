/**************************************
SYSU-Software
Author: Lin Xiaoya
Description:



Last update: 2016.10.8
**************************************/
#include <unordered_map>
#include <fstream>
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <map>
#include <cmath>
#include <cassert>
#include <iomanip>
#define MAX_INT 2000000000

using std::cout;
using std::endl;
using std::string;

std::vector<int> current;
std::vector< std::vector<int> > all_solve;
std::vector<int> rRNA;
std::unordered_map<char, std::vector< std::vector<double> > > score_map;
std::map<int, char> pair_map;
std::map<char, int> reverse_map;

string cds_recorder;

//initialize const values/maps

const double Gmultiinit = 10.1;
const double Gmultibp = -0.3;
const double cR = 8.31, cT = 310.16, ce = 2.718282;

const int all_length = 73;

void build_pair_map(){
	pair_map[0] = 'A';
	pair_map[1] = 'G';
	pair_map[2] = 'C';
	pair_map[3] = 'U';
	reverse_map['A'] = 0;
	reverse_map['G'] = 1;
	reverse_map['C'] = 2;
	reverse_map['U'] = 3;
	reverse_map['T'] = 3;
	reverse_map['N'] = 0;
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

void debug_print_current(){
	for (int i = 0; i < all_length; i++) cout << pair_map[current[i]];
	cout << endl;
	for (int i = 0; i < all_length; i++) cout << current[i] << ' ';
	cout << endl;
}

//Initialize sequence template data
void init_data(string bact_path, string enzy_name){
	build_pair_map();
	build_score_map(all_length);

	//initialize current series and rRNA
	string init_series = "ATACAGGATATCTAGAGAAAGANNNGANNNACTAGATG"; //A template of RBS & starter
	for (size_t i = 0; i < init_series.length(); i++){
		current.push_back(reverse_map[init_series[i]]);
	}
	string init_rRNA = "CGCCTGGGG";
	for (size_t i = 0; i < init_rRNA.length(); i++){
		rRNA.push_back(reverse_map[init_rRNA[i]]);
	}
	bact_path += ".txt";
	std::ifstream fin(bact_path.data());
	string tmp;
	int n;
	fin >> tmp;
	fin >> n;
	string reac_name;
	for (int i = 0; i < n; i++){
		string enzy_tmp;
		int enzy_n;
		fin >> enzy_tmp;
		fin >> enzy_n;
		for (int j = 0; j < enzy_n; j++){
			string reac_tmp;
			fin >> reac_tmp;
			if (enzy_name == enzy_tmp)
				reac_name = reac_tmp;
		}
	}
	fin >> n;
	for (int i = 0; i < n; i++){
		string reac_tmp;
		fin >> reac_tmp;
		string tmp_series;
		fin >> tmp_series;
		if (reac_tmp == reac_name){
			tmp_series = tmp_series.substr(3, tmp_series.length() - 3);
			cds_recorder = tmp_series;
			for (int j = 0; j < 35; j++){
				current.push_back(reverse_map[tmp_series[j]]);
			}
		}
		while (tmp_series[tmp_series.length() - 1] < 97){
			fin >> tmp_series;
			if (reac_tmp == reac_name){
				cds_recorder += tmp_series;
			}
		}
		if (reac_tmp == reac_name) break;
	}
	
	fin.close();

	cout << "Data initialized." << endl;
}

//Enumerate next RBS sequence
bool next_series(int start){
	// cout << "Goto next series" << endl;
	int pointer = 0;
	current[start]++;
	int tmp[6];
	for (int i = 0; i < 3; i++){
		tmp[i] = current[start + i];
		tmp[i + 3] = current[start + i + 5];
	}
	while(tmp[pointer] == 4){
		tmp[pointer++] = 0;
		if (pointer >= 6){
			return false;
		}
		tmp[pointer]++;
	}

	int runcnt = 0;
	for (int i = 0; i < 6; i++){
		// cout << tmp[i];
		runcnt += pow(4, i) * tmp[i];
	}
	if (tmp[0] == 0){
		cout << '\r';
		cout.precision(3);
		cout << std::fixed;
		cout << "Calculating all RBS's strength bound.. " << double(runcnt / pow(4, 6)) * 100.0 << '%';
		cout.flush();
	}

	for (int i = 0; i < 3; i++){
		current[start + i] = tmp[i];
		current[start + i + 5] = tmp[i + 3];
	}
	return true;
}

//Check if bases can be paired
bool paired(int x, int y){
	return x + y == 3 || (x == 1 && y == 3) || (x == 3 && y == 1); //AT & CG & UG
}

double min(double x, double y){
	return x < y ? x : y;
}

inline double Ghairpin(int i, int j) {
	int n = j - i - 1;
	double Ginitiation, Gbonuses;
	const double CGinitiation[10] = {0, 0, 0, 5.7, 5.6, 5.6, 5.4, 5.9, 5.6, 6.4};
	Ginitiation = n <= 9 ? CGinitiation[n] : 6.4 + 1.75 * cR * cT * log(n / 9.0) / log(ce);
	if ((pair_map[current[i + 1]] == 'U' && pair_map[current[j - 1]] == 'U') || 
	    (pair_map[current[i + 1]] == 'G' && pair_map[current[j - 1]] == 'A') ||
	    (pair_map[current[i + 1]] == 'A' && pair_map[current[j - 1]] == 'G')  ) Gbonuses = -0.8; else Gbonuses = 0;
	if ((pair_map[current[i]] == 'G' && pair_map[current[j]] == 'U') ||
		(pair_map[current[i]] == 'U' && pair_map[current[j]] == 'G')  ) Gbonuses += -2.2;
	return Ginitiation + Gbonuses;
}

inline double Ginterior(int i, int d, int e, int j)  {
	int n1 = d - i - 1, n2 = j - e - 1;
	const double CGoinitiation[7] = {0, 0, 0, 0, 1.7, 1.8, 2.0};
	double Goinitiation = n1 + n2 > 6 ? 2.0 + 1.75 * cR * cT * log((n1 + n2) / 6.0) / log(ce) : CGoinitiation[n1 + n2];
	double Goasymm = 0.48 * std::abs(n1 - n2);
	int N = 0;
	if ((pair_map[current[i]] == 'A' && pair_map[current[j]] == 'U') || 
		(pair_map[current[i]] == 'U' && pair_map[current[j]] == 'A') ||
		(pair_map[current[i]] == 'G' && pair_map[current[j]] == 'U') || 
		(pair_map[current[i]] == 'U' && pair_map[current[j]] == 'G')  ) N++;
	if ((pair_map[current[d]] == 'A' && pair_map[current[e]] == 'U') || 
		(pair_map[current[d]] == 'U' && pair_map[current[e]] == 'A') ||
		(pair_map[current[d]] == 'G' && pair_map[current[e]] == 'U') || 
		(pair_map[current[d]] == 'U' && pair_map[current[e]] == 'G')  ) N++;
	double Gaugu = 0.2 * N;
	int m1, m2; m1 = m2 = 0;
	for (int loop_i = i + 1; loop_i <= d - 1; ++loop_i) if (pair_map[current[loop_i]] == 'U') m1++;
	for (int loop_i = e + 1; loop_i <= j - 1; ++loop_i) if (pair_map[current[loop_i]] == 'U') m2++;
	double Guubonus = -0.7 * min(m1, m2);
	return Goinitiation + Goasymm + Gaugu + Guubonus;
}

double Gmulti(int i, int j){
	if (j <= i + 1) return 0;
	return Gmultiinit - 1.05 * (j - i - 1);
}

//Calculating energy's recrusion
double search_struct(int left, int right, char type){
	if (score_map[type][left][right] < MAX_INT) {
		return score_map[type][left][right];
	}
	if (left >= right) {
		score_map[type][left][right] = 0;
		return score_map[type][left][right];
	}

	double min_energy;
	if (type == 'o'){
		min_energy = 0;
	} else
	if (type == 'b'){
		min_energy = Ghairpin(left, right);
	} else
		min_energy = MAX_INT + 1;
	for (int d = left; d <= right - 1; d++){
		for (int e = d + 1; e <= right; e++){
			if (!paired(current[d], current[e])) continue;
			switch (type) {		//for 3 folding structure of mRNA
				case 'o':
					min_energy = min(min_energy, min(0, search_struct(left, d - 1, 'o') + search_struct(d, e, 'b')));
					break;
				case 'b':
					if (left == d) continue;
					if (e == right) continue;
					min_energy = min(min_energy, 
								 min(search_struct(d, e, 'b')+ Ginterior(left, d, e, right), 
								 	 search_struct(left + 1, d - 1, 'm') + search_struct(d, e, 'b') + Gmultiinit + 2.0 * Gmultibp + Gmulti(e + 1, right - 1) ) );
					break;
				case 'm':
					min_energy = min(min_energy, 
								 min(search_struct(d, e, 'b') + Gmultibp + Gmulti(left, d - 1) + Gmulti(e + 1, right),
								 	 search_struct(left, d - 1, 'm') + search_struct(d, e, 'b') + Gmultibp + Gmulti(e + 1, right) ) );
					break;
			}
		}
	}
	score_map[type][left][right] = min_energy;
	return min_energy;
}

//Clear changed parts of the score map for next calculation
void clear_score_map(int start, int length){
	int l = start, r = start + length - 1;
	for (int i = 0; i < all_length - 1; i++){
		for (int j = i + 1; j < all_length; j++){
			if ((i <= l && j >= l )||(i <= r && j >= r)||(i >= l && j <= r)){
				score_map['o'][i][j] = MAX_INT;
				score_map['b'][i][j] = MAX_INT;
				score_map['m'][i][j] = MAX_INT;
			}
		}
	}
}

//Detecting current initiation codon and return its energy
double check_starter(int pos){
	string starter = "";
	for (int i = 0; i < 3; i++) starter += pair_map[current[pos + i]];
	if (starter == "AUG") return -1.19;
	if (starter == "GUG") return -0.075;
	return 0;
}

//mRNA & rRNA's Pairing energy
const std::string nn5[10] = {"AA", "AU", "UA", "CU", "CA", "GU", "GA", "CG", "GG", "GC"};
const std::string nn3[10] = {"UU", "UA", "AU", "GA", "GU", "CA", "CU", "GC", "CC", "CG"};
const double nnG[10] = {-0.93, -1.10, -1.33, -2.08, -2.11, -2.24, -2.35, -2.36, -3.26, -3.42};
inline double Pair(int loc) {
	int n = 0, ni = 0;
	if (pair_map[current[loc - 8]] == 'A' && pair_map[current[loc]] == 'U') n++; 
	if (pair_map[current[loc - 8]] == 'U' && pair_map[current[loc]] == 'A') n++;
	double Gtotal = 4.09 + 0.45 * n;
	std::string s3 = "", s5 = "";
	for (int i = loc - 8; i <= loc; i++){
		s5 += pair_map[current[i]];
		s3 += pair_map[rRNA[i - loc + 8]];
	}
	std::vector<double> Gnn;
	for (int i = 0; i < 8; i++){
		for (int j = 0; j < 10; j++){
			if (s5.substr(i, 2) == nn5[j] && s3.substr(i, 2) == nn3[j]){
				ni++;
				Gnn.push_back(nnG[j]);
				break;
			}
		}
	}

	s3 = "";
	s5 = "";
	for (int i = loc; i >= loc - 8; i--){
		s5 += pair_map[current[i]];
		s3 += pair_map[rRNA[i - loc + 8]];
	}
	for (int i = 0; i < 8; i++){
		for (int j = 0; j < 10; j++){
			if (s5.substr(i, 2) == nn5[j] && s3.substr(i, 2) == nn3[j]){
				ni++;
				Gnn.push_back(nnG[j]);
				break;
			}
		}
	}

	for (int i = 0; i < ni; i++){
		Gtotal += Gnn[i] * ni;
	}
	return Gtotal;
}

//Reculsive calculate Gmrna's energy
double Gmrna(int l, int r){	
	return search_struct(l, r, 'o');
}

const int starter_pos = 35;	//Initiation codon's position

//RBS's energy consists of 4 parts
//Calculate the 4 parts' sum 
double RBS(){
	double allGmrna = Gmrna(0, all_length - 1);
	double Gstart = check_starter(starter_pos);
	double minGms = MAX_INT;
	int minLoc = 19;
	for (int loc = 19; loc < 25; loc++){
		int s = 25 - loc;
		double Gms = s >= 5 ? 0.048 * pow(s - 5, 2) + 0.24 * (s - 5) : 12.2 / pow(1 + pow(ce, 2.5 * (s - 3)), 3);
		Gms += Pair(loc);
		if (Gms < minGms){
			minGms = Gms;
			minLoc = loc; 
		}
	}
	double Gstandby = - std::abs(allGmrna - Gmrna(0, minLoc - 5) - Gmrna(minLoc - 1, all_length - 1));

	// cout << "Gmrna: " <<  allGmrna << endl;
	// cout << "Gstart: " << Gstart << endl;
	// cout << "minGms: " << minGms << endl;
	// cout << "Gstandby: " << Gstandby << endl;
	//if (-Gstandby > 6) return -MAX_INT - 1;
	return allGmrna + Gstart + minGms + Gstandby;
}

//Consts detected enumerated
const int count_series_start = 19; 
const int count_series_length = 8;

bool illegal_series(){
	string cntstr = "";
	for (int i = 0; i < all_length; i++){
		cntstr += pair_map[current[i]];
	}
	//cout << cntstr << endl;
	if (cntstr.find("GAATTC") != string :: npos) return true;
	if (cntstr.find("ACTAGT") != string :: npos) return true;
	if (cntstr.find("CTGCAG") != string :: npos) return true;
	if (cntstr.find("GCGGCCGC") != string :: npos) return true;
	if (cntstr.find("TCTAGA", 8) != string :: npos) return true;
	if (cntstr.find("AUG") < 32) return true;
	if (cntstr.find("GUG") < 35) return true;
	return false;
}

bool my_cmp(const std::vector<int> x, const std::vector<int> y) {
	assert(x.size() >= 74);
	assert(y.size() >= 74);
	return x[73] > y[73];
}

//Generating and alculating all sequences, determining upper bound and lower bound
void calc_bound(){
	current[count_series_start]--;
	while(next_series(count_series_start)){
		current[35] = reverse_map['A'];
		current[36] = reverse_map['U'];
		current[37] = reverse_map['G'];
		if (illegal_series()) continue;
		//debug_print_current();
		clear_score_map(count_series_start, count_series_length);
		double current_energy = RBS();
		if (current_energy > -MAX_INT){
			current.push_back(current_energy * 1000);
			all_solve.push_back(current);
			//cout << all_solve.size() << endl; 
			current.pop_back();
		}		

		//Change starter
		current[35] = reverse_map['G'];
		if (illegal_series()) continue;
		clear_score_map(count_series_start, count_series_length);
		current_energy = RBS();
		if (current_energy > -MAX_INT){
			current.push_back(current_energy * 1000);
			all_solve.push_back(current);
			//cout << all_solve.size() << endl; 
			current.pop_back();
		}
	}
	cout << endl << "Calculation finished." << endl; 
	sort(all_solve.begin(), all_solve.end(), my_cmp);
}

void print_series(std::ofstream &fout, std::vector<int> v){
	for (int i = 0; i < 73; i++){
		fout << pair_map[v[i]];
	}
	fout << endl;
	fout << v[73] / 1000.0 << endl;
}

//print 5 sample vary from lower bound to upper bound
void print_sample(){
	std::ofstream fout("RBS_output.txt");
	int vn = all_solve.size();
	// cout << vn << endl;
	fout << cds_recorder << endl;
	print_series(fout, all_solve[0]);
	print_series(fout, all_solve[(vn - 1) / 4]);
	print_series(fout, all_solve[(vn - 1) / 2]);
	print_series(fout, all_solve[(vn - 1) / 4 * 3]);
	print_series(fout, all_solve[vn - 1]);
	fout.close();
}

void debug_calc_series(string s){
	for (size_t i = 0; i < s.length(); i++){
		current[i] = reverse_map[s[i]];
	}
	cout << "Total: " << RBS() << endl;
}

int main(int argc, char* argv[]){
	if (argc < 2){
		cout << "Usage: ./rbs [name_of_bacteria] [name_of_enzyme]" << endl;
	}
	// cout << argv[1] << endl << argv[2] << endl;
	init_data(argv[1], argv[2]);
	// init_data("aact1035194-hmpcyc", "EC-2.7.7.77_0_pum_0");
	calc_bound();
	print_sample();

	// debug_calc_series("AUACAGGAUAUCUAGAGAAGGGAAUCAAAAACUAGAUGACAAUUUCAAUCAGCGCGGUAAUUUUAGCCGGCGG");
}
