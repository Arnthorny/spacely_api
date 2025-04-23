/* eslint-disable no-underscore-dangle */
require('dotenv').config();

const { Hub } = require('../models');
const { ApiError } = require('../utils/responses');

class HubService {
  daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  static appendTimeStrToGivenDate(timeStr, date) {
    // Time str format is 24-hr format. E.g: 13:00

    const dateTime = date.setUTCHours(0, 0, 0, 0);

    const timeValArr = timeStr.split(':').map((val) => Number(val));

    dateTime.setUTCHours(timeValArr[0]);
    dateTime.setUTCMinutes(timeValArr[1]);

    return dateTime;
  }

  static async validateBookingReqForHub(bookingReq, hubId) {
    const hub = await this.filterBy({ _id: hubId });
    const duplStartTime = new Date(bookingReq.startTime);
    const duplEndTime = new Date(bookingReq.endTime);
    const differenceMs = duplEndTime - duplStartTime;

    if (differenceMs <= 0) {
      throw new ApiError(400, 'Invalid booking range');
    }

    if (differenceMs > hub.maxBookingMinutes * 60 * 1000) {
      throw new ApiError(400, 'Booking exceeded hub max allocatable hours');
    }

    const hubOpenTimeOnBookingDate = this.appendTimeStrToGivenDate(
      hub.openingTime,
      new Date(duplStartTime),
    );
    const hubCloseTimeOnBookingDate = this.appendTimeStrToGivenDate(
      hub.closingTime,
      new Date(duplEndTime),
    );

    if (
      duplStartTime < hubOpenTimeOnBookingDate ||
      duplEndTime > hubCloseTimeOnBookingDate
    ) {
      throw new ApiError(400, 'Booking outside of hub opening hours');
    }

    const bookingDayOfWeek = this.daysOfWeek[duplStartTime.getDay()];

    const hubAvailableDays = hub.availableDays;
    if (!hubAvailableDays.includes(bookingDayOfWeek)) {
      throw new ApiError(400, 'Booking date not within hub available days');
    }
  }

  static async toJsonObj(hub) {
    await hub.populate('org');
    const jsonObj = {
      id: hub.id,
      name: hub.name,
      floorMap: hub.floorMapURL,
      orgName: hub.org.name,
      orgId: hub.org._id,
      openingTime: hub.openingTime,
      closingTime: hub.closingTime,
      isAvailable: hub.isAvailable,
      availableDays: hub.availableDays,
    };
    return jsonObj;
  }

  static async filterBy(param) {
    const res = await Hub.find(param);

    return res;
  }
}
module.exports = HubService;
