/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const schedule = require('node-schedule');

const { HubService, WorkspaceService, EmailService } = require('.');

const { Booking } = require('../models');

const { ApiError } = require('../utils/responses');

class BookingService {
  static bookingReminderJobs = {};

  static bookingCancellerJobs = {};

  static async createBookingReminder(booking) {
    await booking.populate('user');

    const { startTime } = booking;
    async function sendBookingReminder(bookingId) {
      const bookingObj = await Booking.findById(bookingId);
      EmailService.sendBookingReminder(bookingObj);
    }

    const toMS = process.env.REMINDER_EMAIL_TIME_MIN * 60 * 1000;

    const reminderTime = new Date(startTime - toMS);

    if (reminderTime - Date.now() <= 0) return undefined;

    const job = schedule.scheduleJob(
      reminderTime,
      sendBookingReminder.bind(null, String(booking._id)),
    );

    this.bookingReminderJobs[String(booking._id)] = job;

    return job;
  }

  static async createCancellerJob(booking) {
    await booking.populate('user');

    const { startTime } = booking;
    async function sendCancellingJob(bookingId) {
      const bookingObj = await Booking.findById(bookingId);
      if (bookingObj.status !== 'checkedIn') {
        bookingObj.status = 'cancelled';
        await bookingObj.save();
        EmailService.sendBookingCancellation(bookingObj, true);
      }
    }

    const toMS = process.env.CANCEL_BOOKING_LIMIT_TIME_MIN * 60 * 1000;

    const cancellingTime = new Date(startTime + toMS);

    const job = schedule.scheduleJob(
      cancellingTime,
      sendCancellingJob.bind(null, booking),
    );

    this.bookingCancellerJobs[String(booking._id)] = job;

    return job;
  }

  static async createBooking(bookingObj, hubId, workspaceId, userId) {
    const { startTime, endTime } = bookingObj;
    const hub = await HubService.verifyHubBooking(startTime, endTime, hubId);

    this.validateBookingRequest(bookingObj, hub, userId);

    const workspace = WorkspaceService.isValidWorkspaceBooking(
      hub,
      workspaceId,
      startTime,
      endTime,
    );

    if (!workspace) {
      throw new ApiError(400, 'Booking range invalid for given workspace');
    }

    const bookingModelObj = {
      user: userId,
      workspace: workspaceId,
      ...bookingObj,
    };

    const booking = await Booking.create(bookingModelObj);

    await WorkspaceService.addBookingToSlot(
      workspace,
      startTime,
      endTime,
      booking,
    );

    EmailService.sendBookingConfirmation(booking);
    this.createBookingReminder(booking);
    this.createCancellerJob(booking);

    return booking;
  }

  static async editBooking(booking, userId, bookingObj) {
    if (String(booking.user._id) !== userId)
      throw new ApiError(403, 'Forbidden');

    await booking.populate('workspace');

    const { startTime, endTime, description } = bookingObj;
    const hub = await HubService.verifyHubBooking(
      startTime,
      endTime,
      booking.hub._id,
    );

    const isValid1 = WorkspaceService.isValidWorkspaceBooking(
      hub,
      booking.workspace._id,
      startTime,
      endTime,
    );

    if (!isValid1) {
      throw new ApiError(400, 'Booking range invalid for given workspace');
    }

    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.description = description;

    await booking.save();

    await WorkspaceService.addBookingToSlot(
      booking.workspace,
      startTime,
      endTime,
      booking,
      true,
    );

    EmailService.sendBookingEditConfirmation(booking);

    this.bookingReminderJobs[String(booking._id)].cancel();
    this.bookingCancellerJobs[String(booking._id)].cancel();

    this.createCancellerJob(booking);
    this.createBookingReminder(booking);

    return booking;
  }

  static async cancelBooking(booking, userId) {
    if (String(booking.user._id) !== userId)
      throw new ApiError(403, 'Forbidden');

    const bookingId = String(booking._id);
    await booking.populate('workspace');

    booking.status = 'cancelled';

    await booking.save();

    await WorkspaceService.removeBookingFromSlots(
      booking.workspace,
      booking.startTime,
      booking.endTime,
    );

    this.bookingReminderJobs[bookingId].cancel();

    this.bookingReminderJobs[bookingId] = undefined;

    this.bookingCancellerJobs[bookingId].cancel();
    EmailService.sendBookingCancellation(booking);

    return booking;
  }

  static async checkInBooking(booking, admin) {
    // Admin only route
    await booking.populate('user');

    if (booking.user.org._id !== admin.org._id) {
      throw ApiError(403, 'Forbidden');
    }

    booking.status = 'checkedIn';

    await booking.save();
    return booking;
  }

  static async validateBookingRequest(bookingParams, hub, userId) {
    const givenDayISO = bookingParams.startTime.toISOString().split('T');
    const givenDayHubStartDT = HubService.appendTimeStrToGivenDate(
      hub.openingTime,
      new Date(givenDayISO),
    );

    const givenDayHubEndDT = HubService.appendTimeStrToGivenDate(
      hub.closingTime,
      new Date(givenDayISO),
    );

    const bookingsByUserOnGivenDay = Booking.find({
      user: userId,
      startTime: { $gte: givenDayHubStartDT, $lt: givenDayHubEndDT },
    });

    let totalUserMs = bookingsByUserOnGivenDay.reduce(
      (acc, curr) => acc + (curr.endTime - curr.startTime),
      0,
    );

    totalUserMs += bookingParams.endTime - bookingParams.startTime;

    const maxAllowedMs = process.env.MAX_HOURS_BOOKING_PER_DAY * 60 * 60 * 1000;

    if (totalUserMs > maxAllowedMs)
      throw new ApiError(400, 'Booking limit exhausted for particular day');
    return bookingParams;
  }

  static toJsonObj(booking) {
    const jsonObj = {
      id: booking.id,
      status: booking.status,
      description: booking.description,
      startTime: booking.startTime,
      endTime: booking.endTime,
      userId: booking.user._id,
    };

    return jsonObj;
  }

  static async filterBy(param, singleRes = false) {
    const res = await Booking.find(param);

    if (singleRes) return res[0];
    return res;
  }
}

module.exports = BookingService;
