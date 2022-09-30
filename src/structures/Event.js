class Event {
  /**
   * @param {"authenticated" |
   * "auth_failure" |
   * "ready" |
   * "message" |
   * "message_create" |
   * "message_revoke_everyone" |
   * "message_revoke_me" |
   * "message_ack" |
   * "media_uploaded" |
   * "group_join" |
   * "group_leave" |
   * "group_update" |
   * "qr" |
   * "disconnected" |
   * "change_state" |
   * "change_battery"} event
   * @param {*} runFunction
   */
  constructor(event, runFunction) {
    this.event = event;
    this.run = runFunction;
  }
}

module.exports = Event;
