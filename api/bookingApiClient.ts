import { APIRequestContext, expect } from '@playwright/test';

export type BookingPayload = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds: string;
};

export class BookingApiClient {
  readonly request: APIRequestContext;
  static BASE_URL = 'https://restful-booker.herokuapp.com';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  // Authenticate and get a token for protected operations like update/delete
  async authenticate() {
    const response = await this.request.post(`${BookingApiClient.BASE_URL}/auth`, {
      data: { username: 'admin', password: 'password123' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    return body.token as string;
  }

  // Create a new booking and return the ID and full booking details
  async createBooking(payload: BookingPayload) {
    const response = await this.request.post(`${BookingApiClient.BASE_URL}/booking`, {
      headers: { 'Content-Type': 'application/json' },
      data: payload,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    return { bookingid: body.bookingid as number, booking: body.booking as BookingPayload };
  }

  // Retrieve a booking by its ID
  async getBooking(bookingId: number) {
    const response = await this.request.get(`${BookingApiClient.BASE_URL}/booking/${bookingId}`);
    expect(response.status()).toBe(200);
    return (await response.json()) as BookingPayload;
  }

  // Update an existing booking - requires auth token
  async updateBooking(bookingId: number, token: string, payload: BookingPayload) {
    const response = await this.request.put(`${BookingApiClient.BASE_URL}/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
      data: payload,
    });
    expect(response.status()).toBe(200);
    return (await response.json()) as BookingPayload;
  }

  // Delete a booking - requires auth token
  async deleteBooking(bookingId: number, token: string) {
    const response = await this.request.delete(`${BookingApiClient.BASE_URL}/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(response.status()).toBe(201);
  }
}
