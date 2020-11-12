extern "C" {
  int _sum(int*arr, unsigned int l) {
    int r = 0;
    for (int i = 0; i < l; i++) {
      r += arr[i];
    }
    return r;
  }

  int* _duplicate_arr(int*arr, unsigned int l) {
    int*new_arr = new int[l*2];
    for (unsigned int i = 0; i < l*2; i+=2) {
      new_arr[i] = arr[i / 2];
      new_arr[i+1] = arr[i / 2] * 2;
    }
    return new_arr;
  }

  int _sum_matrix(int **arr, unsigned int rows, unsigned int cols) {
      int r = 0;
      for (int i = 0; i < rows; i++) {
          for (int j = 0; i < cols; j++) {
              r += arr[i][j];
          }
      }
      return r;
  }
}