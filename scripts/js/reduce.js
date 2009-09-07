function sum(args) {
  var total = 0;

  for (x in args) {
    if (typeof args[x] == "number") {
      total += args[x];
    }
  }

  return total;
}


