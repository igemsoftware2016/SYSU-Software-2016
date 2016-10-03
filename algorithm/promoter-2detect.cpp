#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include <cmath>

using namespace std;

class promoter{
public:
	string proximal, box35, spacer, box10, disc, start, itr;
	double score;
	promoter(){

	}
	promoter(string seq, double sco){
		this->score = sco;
		int i = 0;
		string tmp = "";
		while (seq[i] >= 97){
			tmp += seq[i++];
		}
		this->proximal = tmp;
		tmp = "";
		while (seq[i] < 97){
			tmp += seq[i++];
		}
		this->box35 = tmp;
		tmp = "";
		while (seq[i] >= 97){
			tmp += seq[i++];
		}
		this->spacer = tmp;
		tmp = "";
		while (seq[i] < 97){
			tmp += seq[i++];
		}
		this->box10 = tmp;
		tmp = "";
		while (seq[i] >= 97){
			tmp += seq[i++];
		}
		this->disc = tmp;
		tmp = "";
		while (seq[i] < 97){
			tmp += seq[i++];
		}
		this->start = tmp;
		tmp = "";
		while (seq[i] >= 97){
			tmp += seq[i++];
		}
		this->itr = tmp;
	}
	double strength(){
		return exp(score);
	}
};

vector<promoter> v;

bool cmp(const promoter &a, const promoter &b){
	return a.score < b.score;
}

void input_data(){
	char c;
	cout << "Clean data?(y/n)";
	cin >> c;
	if (c == 'n'){
		ifstream fin("promoter_data.txt");
		int n;
		fin >> n;
		v.resize(n);
		for (int i = 0; i < v.size(); i++){
			fin >> v[i].proximal >> v[i].box35 >> v[i].spacer >> v[i].box10 >> v[i].disc >> v[i].start >> v[i].itr;
			fin >> v[i].score;	
		}
		fin.close();
	} else {
		string tmps;
		double tmpscore;
		std::ifstream fin("promoter_fulldata.txt");
		while(!fin.eof()){
			fin >> tmps >> tmps >> tmps >> tmps >> tmps >> 
				   tmps >> tmps >> tmps >> tmps >> tmps >> 
				   tmps >> tmps >> tmps >> tmps ;
			fin >> tmpscore;
			getline(fin, tmps);
			int pos = tmps.rfind('\t');
			tmps = tmps.substr(pos + 1, tmps.length() - pos - 1);
			v.push_back(promoter(tmps, tmpscore));
		}
		fin.close();
		sort(v.begin(), v.end(), cmp);
		ofstream fout("promoter_data.txt");
		fout << v.size() << endl;
		for(int i = 0; i < v.size(); i++){
			fout << v[i].proximal << '\t' << v[i].box35 << '\t' << v[i].spacer << '\t' << v[i].box10 << '\t' << v[i].disc << '\t' << v[i].start << '\t' << v[i].itr << '\t';
			fout << v[i].score << endl;		
		}
		fout.close();
	}
}

promoter search_strength(double target, int l, int r){
	if (r - l <= 1) return v[l];
	int mid = (l + r) / 2;
	if (v[mid].strength() > target) return search_strength(target, l, mid);
	return search_strength(target, mid, r);
}

void test_search(){
	promoter x = search_strength(3.1, 0, v.size());
	cout << x.proximal << '\t' << x.box35 << '\t' << x.spacer << '\t' << x.box10 << '\t' << x.disc << '\t' << x.start << '\t' << x.itr << '\t';
	cout << x.score << ' ' << x.strength() << endl;	
}

int main(){
	input_data();
	test_search();
}