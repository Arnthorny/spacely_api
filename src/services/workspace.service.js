/* eslint-disable no-underscore-dangle */
require('dotenv').config();

const { Workspace, Hub, Booking } = require('../models');

const { ApiError } = require('../utils/responses');

class WorkspaceService {
  static appendTimeStrToGivenDate(timeStr, date) {
    // Time str format is 24-hr format. E.g: 13:00

    const dateTime = date.setUTCHours(0, 0, 0, 0);

    const timeValArr = timeStr.split(':').map((val) => Number(val));

    dateTime.setUTCHours(timeValArr[0]);
    dateTime.setUTCMinutes(timeValArr[1]);

    return dateTime;
  }

  static async toJsonObj(workspace) {
    await workspace.populate('hub');

    const jsonObj = {
      id: workspace.id,
      status: workspace.status,
      hubId: workspace.hub._id,
      hubName: workspace.hub.name,
    };
    return jsonObj;
  }

  static async findWorkspaces(startTime, endTime, hubId, status = undefined) {
    const hub = await Hub.findById(hubId);
    if (hub === null) {
      throw new ApiError(404, 'Hub not found');
    }
    let allWorkspaces;

    if (status === undefined) {
      allWorkspaces = await Workspace.find({ hub: hubId });
      return allWorkspaces;
    }

    const hubOpenTimeOnBookingDate = this.appendTimeStrToGivenDate(
      hub.openingTime,
      new Date(startTime),
    );
    const hubCloseTimeOnBookingDate = this.appendTimeStrToGivenDate(
      hub.closingTime,
      new Date(startTime),
    );
  }
}
module.exports = WorkspaceService;
