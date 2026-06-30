import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: __ENV.VUS ? Number(__ENV.VUS) : 10,
  duration: __ENV.DURATION || '5m',
};

const products = [
  '6c17a9a3-9a87-4e6a-b7ea-9002d9771cb3',
  '7683ce89-b8bb-4c97-9fba-7185594ea0b0',
  '6690191e-5165-495b-9721-f5f0fd060f0a',
  '88bde193-6dbc-4246-930f-d95d084e839e',
];
const productId = products[Math.floor(Math.random() * products.length)]||products[0];

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkOTk5OTdlZS1jZGMwLTRhNDktOGZkNi1lMDllOGIwOTQ4MGYiLCJ1c2VySWQiOiJmNTA1ODg0NC1kZjUzLTQ2NjEtODY0Ni1jZGJjNTJlMmRlM2UiLCJlbWFpbCI6ImFkbWluQHRoZXNpcy5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3ODI4MzkyMjUsImV4cCI6MTc4MjkyNTYyNX0.r5OpA1tl78qJWJModHmhHgSiIRxAlYqL1rZcbUdYgdY';

export default function () {
  // if (!token) {
  //   const loginResponse = await http.post(
  //     'http://localhost:4000/auth/login',
  //     JSON.stringify({
  //       email: 'admin@thesis.com',
  //       password: '123456',
  //     }),
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     },
  //   );
  //   token = loginResponse.json('accessToken');
  // }

  const response = http.post(
    'http://localhost:4000/orders',
    JSON.stringify({
      productId: productId,
      quantity: 2,
    }),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  check(response, {
    'order created': (r) => r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
