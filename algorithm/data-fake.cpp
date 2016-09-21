#include <iostream>
#include <set>

using namespace std;

const char * first_line =
	"\"ENZYME\"	\"Substrate\"	\"Substrate_Name\"	\
	\"Product\"	\"Product_Name\"	\"Organism_id\"";

void add_comm(string & x) {
	x = "\"" + x + "\"";
}

void magic(string & x) {
	x = "MER_NAME_" + x;
}

void print_line(string ec,
	string sub, string sub_name,
	string pdt, string pdt_name,
	string org_id) {
	
	add_comm(ec);
	magic(sub_name); add_comm(sub_name); add_comm(sub);
	magic(pdt_name); add_comm(pdt_name); add_comm(pdt);
	add_comm(org_id);

	cout << ec << "\t" << sub << "\t" << sub_name << "\t" << pdt << "\t"
		<< pdt_name << "\t" << org_id << endl;
}

void manual() {
	const int org_size = 10;

	string org = "O";
	string ec = "EC";
	string mer = "C";

	for (int i = 1; i <= org_size; ++ i) {
		for (char j = 1; j <= 9; ++ j)
			print_line(ec + to_string(j),
				mer + to_string(j), mer + to_string(j),
				mer + to_string(j + 1), mer + to_string(j + 1),
				org + to_string(i));
		print_line(ec + to_string(10),
			mer + to_string(10), mer + to_string(10),
			mer + to_string(1), mer + to_string(1),
			org + to_string(i));
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
		for (int j = 0; j < 3; ++ j) {

			int k; do {
				k = (rand() % org_size) + 1;
			} while (used.count(k));
			used.insert(k);

			print_line(ec + to_string(i + 11),
				mer + to_string(from[i]), mer + to_string(from[i]),
				mer + to_string(to[i]), mer + to_string(to[i]),
				org + to_string(k));
		}
	}
}

int main() {

	ios :: sync_with_stdio(false);

	cout << first_line << endl;

	manual();
	
	return 0;
}
