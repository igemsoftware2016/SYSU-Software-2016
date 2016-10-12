#include <fstream>
#include <vector>

using std::endl;

class promoter{
public:
	string sequence;
	double strength;
	promoter(){
		this->sequence = "";
		this->strength = 0;
	}
	promoter(string seq, double stren){
		this->sequence = seq;
		this->strength = stren;
	}
};

std::vector<promoter> v;

promoter search_strength(double target, int l, int r){
	if (r - l <= 1) return v[l];
	int mid = (l + r) / 2;
	if (v[mid].strength() < target) return search_strength(target, mid, r);
	return search_strength(target, l, mid);
}

int main(){
	std::ifstream fdata("promo_strength.txt");
	int n;
	fdata >> n;
	for (int i = 0; i < n; i++){
		string seq;
		double stren;
		fdata >> seq;
		fdata >> stren;
		v.push_bach(promoter(seq, stren));
	}
	fdata.close();

	std::ifstream fin("promoter_input.txt");
	std::ofstream fout("promoter_res.txt");
	double strength;
	while (fin >> strength){
		promoter result = search_strength(target, 0, v.size());
		fout << result.sequence << endl << result.strength << endl;
	}
	fin.close();
	fout.close();
	return 0;
}