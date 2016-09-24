#include <iostream>
#include <fstream>
#include <set>
#include <cstdlib>

using namespace std;

ofstream dout("data-fake.txt");
ofstream oout("org-data-fake.txt");
ofstream kout("org-kcat-fake.txt");
ofstream gout("mer-g-fake.txt");

const char * first_line =
	"\"ENZYME\"	\"Substrate\"	\"Substrate_Name\"\
	\"Product\"	\"Product_Name\"	\"Organism_id\"\
	\"Substrate_Coef\"	\"Product_Coef\"";

void add_comm(string & x) {
	x = "\"" + x + "\"";
}

void magic(string & x) {
	x = "MER_NAME_" + x;
}

void print_line(string ec,
	string sub, string sub_name,
	string pdt, string pdt_name,
	string org_id, string sub_coff, string pdt_coff) {
	
	add_comm(ec);
	magic(sub_name); add_comm(sub_name); add_comm(sub);
	magic(pdt_name); add_comm(pdt_name); add_comm(pdt);
	add_comm(org_id);
	add_comm(sub_coff); add_comm(pdt_coff);

	dout << ec << "\t" << sub << "\t" << sub_name << "\t" << pdt << "\t"
		<< pdt_name << "\t" << org_id << "\t" << sub_coff << "\t" << pdt_coff << endl;
	
	string kcat = to_string((rand() % 50) / 50.0);
	add_comm(kcat);

	kout << org_id << '\t' << ec << '\t' << kcat << endl;
}

void manual() {
	const int org_size = 10;

	kout << "\"ORG\" \"EC\" \"KCAT\"" << endl;

	string org = "O";
	string ec = "EC";
	string mer = "C";

	for (char j = 1; j <= 10; ++ j) {
		string sub_coff = to_string((rand() % 5) + 1);
		string pdt_coff = to_string((rand() % 5) + 1);

		for (int i = 1; i <= org_size; ++ i) {
			if (j != 10)
				print_line(ec + to_string(j),
					mer + to_string(j), mer + to_string(j),
					mer + to_string(j + 1), mer + to_string(j + 1),
					org + to_string(i), sub_coff, pdt_coff);
			else
				print_line(ec + to_string(10),
					mer + to_string(10), mer + to_string(10),
					mer + to_string(1), mer + to_string(1),
					org + to_string(i), sub_coff, pdt_coff);
		}
	}

	const int edge_count = 21;
	const int from[edge_count] = {
		4, 11, 12, 13, 12, 15, 15, 1, 18, 19, 18, 21, 21, 2, 13, 25, 14, 10, 3, 16, 27
	};
	const int to[edge_count] = {
		11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 17, 25, 26, 27, 24, 12, 28, 28
	};

	for (int i = 0; i < edge_count; ++ i) {
		set <int> used;
		string sub_coff = to_string((rand() % 5) + 1);
		string pdt_coff = to_string((rand() % 5) + 1);

		for (int j = 0; j < 3; ++ j) {

			int k; do {
				k = (rand() % org_size) + 1;
			} while (used.count(k));
			used.insert(k);

			print_line(ec + to_string(i + 11),
				mer + to_string(from[i]), mer + to_string(from[i]),
				mer + to_string(to[i]), mer + to_string(to[i]),
				org + to_string(k), sub_coff, pdt_coff);
		}
	}
	
	oout << "\"usable org\"" << endl;
	for (int i = 1; i < 10; i += 2) {
		string str = org + to_string(i);
		add_comm(str);
		oout << str << ' ';
	}
	oout << "\"O4\" \"O10\"";
	oout << endl;

	oout << "\"ORG\" \"MER\"" << endl;
	for (int i = 1; i <= 10; ++ i) {
		for (int j = 22; j <= 28; j += 2) {
			string O = org + to_string(i); add_comm(O);
			string M = mer + to_string(j); add_comm(M);
			oout << O << ' ' << M << endl;
		}
		string O = org + to_string(i); add_comm(O);
		string M = mer + to_string(27); add_comm(M);
		oout << O << ' ' << M << endl;
	}
	
	for (int i = 1; i <= 10; ++ i)
		for (int j = 10; j < 28; ++ j)
			if (rand() % 100 < 20) {
				string O = org + to_string(i); add_comm(O);
				string M = mer + to_string(j); add_comm(M);
				oout << O << ' ' << M << endl;
			}

	gout << "\"MER\"\t\"G\"" << endl;
	for (int i = 1; i <= 28; ++ i) {
		string M = mer + to_string(i); add_comm(M);
		string G = to_string(((rand() % 32768) - 16384)/ 32767.0); add_comm(G);
		gout << M << '\t' << G << endl;
	}
}

int main() {
	srand(1996-01-04);

	ios :: sync_with_stdio(false);

	dout << first_line << endl;

	manual();
	
	return 0;
}
