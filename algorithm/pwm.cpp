#include <fstream>
#include <string>
#include <memory.h>
#include <cmath>
#include <vector>
#include <map>
#include <iostream> 
#define POSSTD 100
#define MAXDATA 100

//using std :: vector;
int n;	//Elements counter for mathematical calculating conveniences
using std::string;
using std::cout;
using std::endl; 
std::vector< std::vector<string> > cp;
std::vector< std::vector<string> > ue;
std::vector< std::vector<double> > cpScore;
std::vector< std::vector<double> > ueScore;
std::map<char, int> code;

void InputData(){
	std::ifstream fin("pwmdata.txt");
	while(!fin.eof()){
		std::vector<string> ues;
		std::vector<string> cps;
		string sin;
		for (int i = 0; i < 3; i++){
			fin >> sin;
			if (sin.length() == 0) break;
			ues.push_back(sin);
		}
		if (sin.length() == 0) break;
		for (int i = 0; i < 6; i++){
			fin >> sin;
			cps.push_back(sin);
		}
		cp.push_back(cps);
		ue.push_back(ues);
		n++;
	}
	fin.close();
}

void InitCode(){
	code['A'] = 0;
	code['C'] = 1;
	code['G'] = 2;
	code['T'] = 3;
}

void PWMProcess(){
	InitCode();
	//int nb[4][POSSTD + 100], S[MAXDATA], D[MAXDATA], length[MAXDATA], length_hash[200];

	//Core-promoter score calculating
	std::vector< std::vector<int> > nb;
	nb.resize(4);
	for (int i = 0; i < 4; i++) nb[i].resize(POSSTD + 100);
	std::vector<int> Shash, Dhash;
	Shash.resize(300);
	Dhash.resize(300);
	int Fs = 0, Fd = 0;
	for(int i = 0; i < n; i++){
		int cnt = 0;
		for (int j = 0; j < 3; j++){
			cnt += cp[i][j].length();
		}
		for (int j = 0; j < 3; j++){
			for (int k = 0; k < cp[i][j].length(); k++){
				nb[code[cp[i][j][k]]][POSSTD - cnt--]++;
			}
		}
		cnt = 0;
		for (int j = 3; j < 6; j++){
			for (int k = 0; k < cp[i][j].length(); k++){
				nb[code[cp[i][j][k]]][POSSTD + cnt + k]++;
			}
			cnt += cp[i][j].length();
		}
		Shash[cp[i][1].length()]++;
		if (Shash[cp[i][1].length()] > Fs) Fs = Shash[cp[i][1].length()];
		Dhash[cp[i][3].length()]++;
		if (Dhash[cp[i][3].length()] > Fd) Fd = Dhash[cp[i][3].length()];
	}
	
	//int pwm[MAXDATA][POSSTD + 100];
	std::vector< std::vector<double> > pwm;
	for (int i = 0; i < n; i++){
		std::vector<double> row;
		std::vector<double> score;
		row.resize(POSSTD + 100);
		int cnt = 0;
		for (int j = 0; j < 3; j++){
			cnt += cp[i][j].length();
		}
		for (int j = 0; j < 3; j++){
			double zoneScore = 0;
			for (int k = 0; k < cp[i][j].length(); k++){
				row[POSSTD - cnt] = log(double(nb[code[cp[i][j][k]]][POSSTD - cnt] + 0.005 * n) * double(n + 0.02 * n) * 4.0);
				zoneScore += row[POSSTD - cnt];
				cnt--;
			}
			if (j == 1) zoneScore -= log(double(Shash[cp[i][1].length()] + 0.0005 * Fs) / double(1.005 * Fs));
			score.push_back(zoneScore);
		}
		cnt = 0;
		for (int j = 3; j < 6; j++){
			double zoneScore = 0;
			for (int k = 0; k < cp[i][j].length(); k++){
				row[POSSTD + cnt + k] = log(double(nb[code[cp[i][j][k]]][POSSTD + cnt + k] + 0.005 * n) * double(n + 0.02 * n) * 4.0);
				zoneScore += row[POSSTD + cnt + k];
			}
			if (j == 3) zoneScore -= log(double(Dhash[cp[i][3].length()] + 0.0005 * Fd) / double(1.005 * Fd));
			score.push_back(zoneScore);
			cnt += cp[i][j].length();
		}
		cpScore.push_back(score);
	}

	//Up-element score calculating
	for (int i = 0; i < n; i++){
		std::vector<double> score;
		for (int j = 0; j < 3; j++){
			double zoneScore = 0;
			for (int k = 0; k < ue[i][j].length() - 2; k++){
				if ((ue[i][j][k] == 'A' || ue[i][j][k] == 'T') && ue[i][j][k] == ue[i][j][k + 1] && ue[i][j][k + 1] == ue[i][j][k + 2]) zoneScore += 1;
			}
			score.push_back(zoneScore);
		}
		ueScore.push_back(score);
	}
}

void PrintResult(){
	std::ofstream fout("score.txt");
	for (int i = 0; i < n; i++){
		//cout << ueScore.size() << ' ' << cpScore.size() << endl;
		for (int j = 0; j < 3; j++) fout << ueScore[i][j] << '\t';
		for (int j = 0; j < 6; j++) fout << cpScore[i][j] << '\t';
		fout << std::endl;
	}
	fout.close();
} 

int main(){
	InputData();
	PWMProcess();
	PrintResult();
} 
