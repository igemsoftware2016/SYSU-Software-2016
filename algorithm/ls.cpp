#include "./ls.h"
const int element = 6;
void leastSquares(float *x, int n, float *y, float *result){
    Eigen::MatrixXf X(n, element);
    for (int i = 0; i < n; i++){
        for (int j = 0; j < element; j++){
            X(i, j) = x[i * element + j];
        }
    }
    Eigen::MatrixXf XT = X.transpose();
    Eigen::VectorXf Y(n);
    for (int i = 0; i < n; i++){
        Y(i) = y[i];
    }
    Eigen::MatrixXf product = XT * X;
    Eigen::MatrixXf beta = product.inverse() * XT;
    beta = beta * Y;
    for (int i = 0; i < element; i++){
        result[i] = beta(i, 0);
    }
}