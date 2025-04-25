/* eslint-disable no-underscore-dangle */
require('dotenv').config();

const { Workspace } = require('../models');
const { HubService } = require('.');
const { isEmpty } = require('../utils/helper_functions');
const { ApiError } = require('../utils/responses');

const { ObjectId } = require('mongoose').Types;

class WorkspaceService {
  static generateEmptyWorkspaceSlots(
    intervalStartDT,
    intervalEndDT,
    array = false,
    interval = process.env.TIME_SLOT_INTERVAL_MIN,
  ) {
    const slotObj = {};
    for (let i = intervalStartDT; i <= intervalEndDT; i += interval) {
      slotObj[i] = undefined;
    }
    if (array) return Object.keys(slotObj);

    return slotObj;
  }

  static async removeBookingFromSlots(workspace, prevStartTime, prevEndTime) {
    const arrOfSlots = this.generateEmptyWorkspaceSlots(
      prevStartTime,
      prevEndTime,
      true,
    );

    const prevBookingDayISO = prevStartTime.toISOString().split('T')[0];
    const prevSlots = workspace.bookingHistory[prevBookingDayISO];

    arrOfSlots.forEach((key) => {
      prevSlots[key] = undefined;
    });

    await workspace.save();
  }

  static async addBookingToSlot(
    workspace,
    newStartTime,
    newEndTime,
    booking,
    removeExisting = false,
  ) {
    const arrOfSlots = this.generateEmptyWorkspaceSlots(
      newStartTime,
      newEndTime,
      true,
    );

    const bookingId = String(booking.id);

    if (removeExisting)
      await this.removeBookingFromSlots(
        workspace,
        booking.startTime,
        booking.endTime,
      );

    const givenDayISO = newStartTime.toISOString().split('T')[0];

    const slotsForDay = workspace.bookingHistory[givenDayISO];

    arrOfSlots.forEach((slot) => {
      slotsForDay[slot] = bookingId;
    });

    await workspace.save();

    return workspace;
  }

  static async isValidWorkspaceBooking(hub, workspaceId, startTime, endTime) {
    const givenDayISO = startTime.toISOString().split('T')[0];

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) throw new ApiError(404, 'Workspace not found');

    const givenDayHubStartDT = HubService.appendTimeStrToGivenDate(
      hub.openingTime,
      new Date(givenDayISO),
    );

    const givenDayHubEndDT = HubService.appendTimeStrToGivenDate(
      hub.closingTime,
      new Date(givenDayISO),
    );

    const { bookingHistory } = workspace;

    if (isEmpty(bookingHistory)) {
      workspace.bookingHistory = {
        givenDayISO: this.generateEmptyWorkspaceSlots(
          givenDayHubStartDT,
          givenDayHubEndDT,
        ),
      };
      await workspace.save();
      return workspace;
    }

    const currBookingSlotList = this.generateEmptyWorkspaceSlots(
      startTime,
      endTime,
      true,
    );
    const checkOverlapSlot = currBookingSlotList.find(
      (slot) => bookingHistory[slot] !== undefined,
    );
    if (checkOverlapSlot === undefined) return workspace;
    return undefined;
  }

  static async retrieveWorkspaceEtBooking(
    hub,
    givenDayISO,
    workspaceId = undefined,
  ) {
    const givenDayHubStartDT = HubService.appendTimeStrToGivenDate(
      hub.openingTime,
      new Date(givenDayISO),
    );
    const givenDayHubEndDT = HubService.appendTimeStrToGivenDate(
      hub.closingTime,
      new Date(givenDayISO),
    );
    const firstMatchObj = {
      hub: hub._id,
      status: { $ne: 'unavailable' },
    };
    if (workspaceId) firstMatchObj._id = ObjectId(workspaceId);

    const workspacesAndBookings = await Workspace.aggregate([
      {
        $match: firstMatchObj,
      },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          let: { dayStart: givenDayHubStartDT, dayEnd: givenDayHubEndDT },
          foreignField: 'workspace',
          as: 'bookings',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gte: ['$startTime', '$$dayStart'] },
                    { $gte: ['$endTime', '$$dayEnd'] },
                    { $ne: ['$status', 'cancelled'] },
                  ],
                },
              },
            },
          ],
        },
      },
    ]);

    return workspacesAndBookings;
  }

  static async toJsonObj(
    workspace,
    hub,
    bookingAggregate = false,
    userId = undefined,
  ) {
    let jsonObj;

    if (!bookingAggregate) {
      jsonObj = {
        id: workspace.id,
        status: workspace.status,
        hubId: hub._id,
        hubName: hub.name,
      };

      return jsonObj;
    }

    jsonObj = {
      id: workspace.id,
      name: `${workspace.type} ${workspace.number}`,
      status: workspace.status,
      hubId: hub._id,
      hubName: hub.name,
      bookings: workspace.bookings
        ? this.bookingArrToJson(workspace.bookings, userId)
        : [],
    };
    return jsonObj;
  }

  static bookingArrToJson(bookingArr, userId) {
    const newArr = bookingArr.map((booking) => {
      const jsonObj = {
        id: booking.id,
        status: booking.status,
        description: booking.description,
        startTime: booking.startTime,
        endTime: booking.endTime,
        userId: booking.user._id,
        isUser: String(booking.user._id) === userId,
      };

      return jsonObj;
    });

    return newArr;
  }
}
module.exports = WorkspaceService;
