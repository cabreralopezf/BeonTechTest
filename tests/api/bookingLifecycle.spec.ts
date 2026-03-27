import { test, expect } from '@playwright/test';
import { BookingApiClient, BookingPayload } from '../../api/bookingApiClient';

test.describe('Restful-Booker API booking lifecycle', () => {
  test('should create, retrieve, update, and delete booking sequentially', async ({ request }) => {
    // First, we need to authenticate to get a token for protected operations
    const client = new BookingApiClient(request);
    const authToken = await client.authenticate();

    // Prepare booking details for a new reservation
    const newBooking: BookingPayload = {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 220,
      depositpaid: true,
      bookingdates: { checkin: '2026-05-01', checkout: '2026-05-10' },
      additionalneeds: 'Breakfast',
    };

    // Create the booking and verify we get back an ID
    const createdBooking = await client.createBooking(newBooking);
    expect(createdBooking.bookingid).toBeDefined();

    // Fetch the booking to ensure it was stored correctly
    const retrievedBooking = await client.getBooking(createdBooking.bookingid);
    expect(retrievedBooking).toEqual(newBooking);

    // Now update the checkout date - this requires the auth token
    const updatedBookingDetails: BookingPayload = {
      ...newBooking,
      bookingdates: { checkin: newBooking.bookingdates.checkin, checkout: '2026-06-01' },
    };
    const updatedBooking = await client.updateBooking(createdBooking.bookingid, authToken, updatedBookingDetails);
    expect(updatedBooking.bookingdates.checkout).toBe('2026-06-01');

    // Double-check the update by fetching again
    const confirmedBooking = await client.getBooking(createdBooking.bookingid);
    expect(confirmedBooking.bookingdates.checkout).toBe('2026-06-01');

    // Clean up: delete the booking
    await client.deleteBooking(createdBooking.bookingid, authToken);

    // Verify it's gone - should return 404
    const deletedResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${createdBooking.bookingid}`);
    expect(deletedResponse.status()).toBe(404);
  });
});