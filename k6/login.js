import { check } from 'k6';
import http from 'k6/http';

export const options = {
  vus: __ENV.VUS ? Number(__ENV.VUS) : 10,
  duration: __ENV.DURATION || '5m',
};

export default function () {
  const res = http.post(
    'http://localhost:4000/auth/login',
    JSON.stringify({
      email: 'admin@thesis.com',
      password: '123456',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  check(res, {
    'login successful': (r) => r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
