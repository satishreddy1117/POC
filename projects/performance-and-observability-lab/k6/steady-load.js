import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    steady: {
      executor: 'constant-arrival-rate',
      rate: Number(__ENV.TARGET_RPS || 12),
      timeUnit: '1s',
      duration: __ENV.DURATION || '30s',
      preAllocatedVUs: 10,
      maxVUs: 100
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<900']
  }
};

export default function () {
  const response = http.get(`${__ENV.BASE_URL || 'http://localhost:4173'}/health`);
  check(response, { 'health is successful': item => item.status === 200 });
  sleep(0.01);
}
