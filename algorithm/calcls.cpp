#include <iostream>
#include <fstream>
#include <cmath>
#include "./ls.h"

using namespace std;

const int element = 6;

int main(){
    int n, nfact;
    float x[900], y[100];
    ifstream fin("./data_ls.txt");
    fin >> n;
    for (int i = 0; i < n; i++){
        fin >> y[i];
    }
    for (int i = 0; i < n; i++){
        float tmp;
        if (y[i] < 0){
            for (int j = 0; j < element; j++) fin >> tmp;
            continue;
        }
        nfact++;
        y[i] = log(y[i]);
        for (int j = 0; j < element; j++){
            fin >> x[i * element + j];
        }
    }
    fin.close();

    float *res = (float *)malloc(sizeof(float) * element);
    leastSquares(x, nfact, y, res);

    ofstream fout("./ls_result.txt");
    for (int i = 0; i < element; i++){
        fout << res[i] << endl;
    }
    fout.close();
    
    return 0;
}