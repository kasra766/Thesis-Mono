import { check } from 'k6';
import http from 'k6/http';

export const options = {
  vus: __ENV.VUS ? Number(__ENV.VUS) : 10,
  duration: __ENV.DURATION || '5m',
};

const token= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NTNjYWZhZi02MDU4LTQ3YzYtOTAzOS03M2U4OWY5MmVmZDgiLCJ1c2VySWQiOiIwYjRlNWM4OS1hNTcwLTQxYzUtODNkMC1lZTc5MWVkMzRlYzUiLCJlbWFpbCI6ImFkbWluQHRoZXNpcy5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3ODI3MjYzMDMsImV4cCI6MTc4MjgxMjcwM30.f769zHWME0ykcjP4HqSfj6dZbG7Np-xm7-2MsalEXVI'

export default function () {
//   if (!token) {
//     const loginResponse = http.post(
//       'http://localhost:4000/auth/login',
//       JSON.stringify({
//         email: 'admin@thesis.com',
//         password: '123456',
//       }),
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       },
//     );
//     token = loginResponse.json('accessToken');
//   }

  const response = http.get('http://localhost:4000/orders?limit=20&page=1', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  check(response, {
    'order retrieved': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
