import { APIRequestContext, expect } from '@playwright/test';

const BASE_URL = 'https://restful-booker.herokuapp.com';

export type BookingPayload = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
};

export async function authenticate(request: APIRequestContext) {
  const response = await request.post(`${BASE_URL}/auth`, {
    data: { username: 'admin', password: 'password123' },
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('token');
  return body.token as string;
}

export async function createBooking(request: APIRequestContext, payload: BookingPayload) {
  const response = await request.post(`${BASE_URL}/booking`, {
    data: payload,
    headers: { 'Content-Type': 'application/json' },
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('bookingid');
  return { bookingid: body.bookingid as number, booking: body.booking as BookingPayload };
}

export async function getBooking(request: APIRequestContext, bookingId: number) {
  const response = await request.get(`${BASE_URL}/booking/${bookingId}`);
  expect(response.status()).toBe(200);
  const body = (await response.json()) as BookingPayload;
  return body;
}

export async function updateBooking(
  request: APIRequestContext,
  bookingId: number,
  token: string,
  payload: BookingPayload,
) {
  const response = await request.put(`${BASE_URL}/booking/${bookingId}`, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${token}`,
    },
    data: payload,
  });
  expect(response.status()).toBe(200);
  return (await response.json()) as BookingPayload;
}

export async function deleteBooking(request: APIRequestContext, bookingId: number, token: string) {
  const response = await request.delete(`${BASE_URL}/booking/${bookingId}`, {
    headers: {
      Cookie: `token=${token}`,
    },
  });
  expect(response.status()).toBe(201);
}
