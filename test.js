const warasList = [1, 2];
const x = warasList.filter((day) => { return day === 1 });
x[0] = 2;
console.log(x);
console.log(warasList);