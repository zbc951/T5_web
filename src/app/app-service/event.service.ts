import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  static DEL_LETTER = 'del-letter';
  static DEL_ALL_LETTER = 'del_all_letter';
  static READ_ALL_LETTER = 'read_all_letter';


  static REFRESHWALLET = 'refreshWallet';
  static READPOLICY = 'readPolicy';
  static OPEN_MENU = 'openmenu';

  static CLOSE_PRIORITY_CONFIRM = 'close_priority_confirm';
  static LEAVE_PRIORITY_CONFIRM = 'leave_priority_confirm';

  static CLOSE_WITHDRAW_DRAWBACK = 'close_withdraw_drawback';
  static CLOSE_WITHDRAW_BET = 'close_withdraw_bet';

  static TRANSFER_UPDATE_PLATFORMWALLET = 'transfer_update_platformwallet';

  static MAINTAIN_UPDATE = 'maintain_update';

  constructor() { }

  static dispatch(eventName, data = null) {

    if (!eventName) {
      return;
    }

    if (data != null && data != undefined) {

      window.dispatchEvent(new CustomEvent(eventName, {
        detail: {
          'data': data
        }
      }));

    } else {
      window.dispatchEvent(new CustomEvent(eventName));
    }

  }
}
