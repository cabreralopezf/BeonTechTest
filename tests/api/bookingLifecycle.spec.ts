import { test, expect } from '@playwright/test';
import { BookingApiClient, BookingPayload } from '../../api/bookingApiClient';

test.describe('Restful-Booker API booking lifecycle', () => {
  test('should create, retrieve, update, and delete booking sequentially', async ({ request }) => {
    const client = new BookingApiClient(request);
    const authToken = await client.authenticate();

    const newBooking: BookingPayload = {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 220,
      depositpaid: true,
      bookingdates: { checkin: '2026-05-01', checkout: '2026-05-10' },
      additionalneeds: 'Breakfast',
    };

    const createdBooking = await client.createBooking(newBooking);
    expect(createdBooking.bookingid).toBeDefined();

    const retrievedBooking = await client.getBooking(createdBooking.bookingid);
    expect(retrievedBooking).toEqual(newBooking);

    const updatedBookingDetails: BookingPayload = {
      ...newBooking,
      bookingdates: { checkin: newBooking.bookingdates.checkin, checkout: '2026-06-01' },
    };
    const updatedBooking = await client.updateBooking(createdBooking.bookingid, authToken, updatedBookingDetails);
    expect(updatedBooking.bookingdates.checkout).toBe('2026-06-01');

    const confirmedBooking = await client.getBooking(createdBooking.bookingid);
    expect(confirmedBooking.bookingdates.checkout).toBe('2026-06-01');

    await client.deleteBooking(createdBooking.bookingid, authToken);
    const deletedResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${createdBooking.bookingid}`);
    expect(deletedResponse.status()).toBe(404);
  });
});