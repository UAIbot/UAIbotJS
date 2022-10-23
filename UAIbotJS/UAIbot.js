function add(numbers) {
  let sum = 0;

  for (const n of numbers) {
    sum += n;
  }

  return sum;
}

function double(number) {
  return 2 * number;
}

export { add, double };
