import { check } from 'k6';
import http from 'k6/http';

export const options = {
  vus: __ENV.VUS ? Number(__ENV.VUS) : 10,
  duration: __ENV.DURATION || '5m',
};


export default function () {
  const res = http.get('http://localhost:4000/products?limit=20&page=1');

  check(res, {
    'products retrieved': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
