export type PersonRow = {
  id: string;
  name: string;
  age: number;
  country: string;
  department: string;
};

const countries = ['DE', 'PL', 'FR', 'ES', 'IT', 'US', 'CA'] as const;
const depts = ['Ops', 'Dev', 'QA', 'HR', 'Finance'] as const;

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makePeople(count = 5000, seed = 42): PersonRow[] {
  const rnd = mulberry32(seed);
  const rows: PersonRow[] = [];
  for (let i = 0; i < count; i++) {
    const id = String(i + 1);
    const age = Math.floor(18 + rnd() * 48);
    const country = countries[Math.floor(rnd() * countries.length)];
    const department = depts[Math.floor(rnd() * depts.length)];
    rows.push({ id, name: `User ${id}`, age, country, department });
  }
  return rows;
}
