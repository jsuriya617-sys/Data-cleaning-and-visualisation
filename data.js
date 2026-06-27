// ── Raw Dataset (intentionally dirty) ────────────────────────────────────────
export const RAW_DATA = [
  { id: 1,  name: "Alice",   age: 29,   salary: 72000,  dept: "Engineering", score: 88,  joined: "2021-03" },
  { id: 2,  name: "Bob",     age: null,  salary: 85000,  dept: "Marketing",   score: 74,  joined: "2020-07" },
  { id: 3,  name: "Carol",   age: 34,   salary: null,   dept: "Engineering", score: 91,  joined: "2019-11" },
  { id: 4,  name: "Dave",    age: 28,   salary: 67000,  dept: "HR",          score: 62,  joined: "2022-01" },
  { id: 5,  name: "Eve",     age: 999,  salary: 91000,  dept: "Engineering", score: 95,  joined: "2018-06" },
  { id: 6,  name: "Frank",   age: 41,   salary: 105000, dept: "Marketing",   score: 78,  joined: "2017-09" },
  { id: 7,  name: "Grace",   age: 33,   salary: 78000,  dept: "HR",          score: null, joined: "2021-05" },
  { id: 8,  name: "Hank",    age: 27,   salary: 63000,  dept: "Engineering", score: 81,  joined: "2023-02" },
  { id: 9,  name: "Ivy",     age: 36,   salary: 88000,  dept: "Marketing",   score: 85,  joined: "2020-03" },
  { id: 10, name: "Jack",    age: 29,   salary: 72000,  dept: "Engineering", score: 88,  joined: "2021-03" }, // dup
  { id: 11, name: "Alice",   age: 29,   salary: 72000,  dept: "Engineering", score: 88,  joined: "2021-03" }, // dup
  { id: 12, name: "Liam",    age: 45,   salary: 120000, dept: "Management",  score: 92,  joined: "2015-01" },
  { id: 13, name: "Mia",     age: 31,   salary: -5000,  dept: "HR",          score: 70,  joined: "2022-08" }, // negative salary
  { id: 14, name: "Noah",    age: 38,   salary: 97000,  dept: "Engineering", score: 89,  joined: "2019-04" },
  { id: 15, name: "Olivia",  age: 26,   salary: 61000,  dept: "Marketing",   score: 73,  joined: "2023-06" },
  { id: 16, name: "Paul",    age: 52,   salary: 140000, dept: "Management",  score: 96,  joined: "2013-03" },
  { id: 17, name: "Quinn",   age: null,  salary: 74000,  dept: "Engineering", score: 84,  joined: "2021-09" },
  { id: 18, name: "Rose",    age: 29,   salary: 71000,  dept: "HR",          score: null, joined: "2022-04" },
  { id: 19, name: "Sam",     age: 34,   salary: 83000,  dept: "Marketing",   score: 77,  joined: "2020-11" },
  { id: 20, name: "Tina",    age: 44,   salary: 115000, dept: "Management",  score: 90,  joined: "2016-07" },
];

export const DEPT_COLORS = {
  Engineering: "#38bdf8",
  Marketing:   "#f472b6",
  HR:          "#a78bfa",
  Management:  "#34d399",
};
