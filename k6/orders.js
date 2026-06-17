import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,
  duration: '1m',
};

const products = [
  '5a0f88d1-6508-4b8b-bdf4-de73307a3f26',
  '8b9f410d-c9a2-4ae2-9735-3843e76a1736',
  'c0f84deb-aeea-4a57-9a2c-ea27ad77d5cf',
  'b99c1195-5c66-47b7-91f2-0f23003738d6',
];
const productId = products[Math.floor(Math.random() * products.length)];

let token;

export default function () {
  if (!token) {
    const loginResponse = http.post(
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
    token = loginResponse.json('accessToken');
  }

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
  });
}
