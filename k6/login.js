import http from 'k6/http';

export const options = {
  vus: 50,
  duration: '1m',
};

export default function () {

  http.post(
    'http://localhost:4000/auth/login',
    JSON.stringify({
      email: 'test@test.com',
      password: '123456',
    }),
    {
      headers: {
        'Content-Type':
          'application/json',
      },
    },
  );
}