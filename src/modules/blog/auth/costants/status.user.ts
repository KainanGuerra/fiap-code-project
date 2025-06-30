import { EventEmitter2 } from '@nestjs/event-emitter';

export enum StatusUser {
  PENDING = 'PENDING',
  ACTIVATED = 'ACTIVATED',
  INACTIVATED = 'INACTIVATED',
}

export enum StatusUserAction {
  ENABLE = 'enable',
  DISABLE = 'disable',
}

export type StatusUserActionFns = {
  [s in StatusUserAction]: (eventEmitter?: EventEmitter2) => Promise<void>;
};
