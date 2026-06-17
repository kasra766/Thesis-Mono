 import http from 'k6/http';

export const options = {
  vus: 100,
  duration: '1m',
};

export default function () {

  http.get(
    'http://localhost:4000/products/5a0f88d1-6508-4b8b-bdf4-de73307a3f26',
  );
}