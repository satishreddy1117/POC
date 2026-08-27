function createRandom(seed = 42) {
  let state = Math.abs(Math.trunc(seed)) || 42;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const names = ['Alex Example', 'Jordan Sample', 'Taylor Demo', 'Morgan Test', 'Casey Fixture'];
const cities = ['Denver', 'Austin', 'Raleigh', 'Madison', 'Portland'];

export function generateSyntheticRecords({ count = 5, seed = 42 } = {}) {
  const random = createRandom(seed);
  return Array.from({ length: Math.max(0, Math.trunc(count)) }, (_, index) => {
    const name = names[index % names.length];
    const number = String(1000 + Math.floor(random() * 8999));
    return {
      recordId: `SYN-${String(index + 1).padStart(4, '0')}`,
      fullName: name,
      email: `${name.toLowerCase().replace(' ', '.')}+${number}@example.test`,
      phone: `555-010-${number.slice(-4)}`,
      accountNumber: `TEST-${number}`,
      address: { city: cities[index % cities.length], postalCode: `000${index + 1}` },
      source: 'synthetic-generator',
      seed
    };
  });
}
