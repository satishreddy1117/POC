import { generateSyntheticRecords } from './synthetic-data.mjs';
import { maskRecord } from './masker.mjs';
import { enforcePolicy } from './data-policy.mjs';

const records = generateSyntheticRecords({ count: 3, seed: 2026 });
const policyResult = enforcePolicy(records, { syntheticOnly: true, environment: 'test', retentionDays: 30 });
console.log(JSON.stringify({
  policy: policyResult,
  generatedRecords: records,
  maskedPreview: records.map(record => maskRecord(record))
}, null, 2));
