import { IStateMachine } from '@ihelpee/javascript-state-machine';
import { UnprocessableEntityException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getMetadataArgsStorage } from 'typeorm';
import { EventListenerTypes } from 'typeorm/metadata/types/EventListenerTypes';
import { camelCase } from 'typeorm/util/StringUtils';

import { StateMachineLoader } from '../loaders/state-machine.loader';

export type ErrorFactory<Entity, Status, Action> = (
  entity: Entity,
  transition: Action,
  from: Status,
  to: Status,
) => Error;

export type HookParam<Entity, Status, Action> = {
  transition: Action | 'init';
  from: Status;
  to: Status;
  entity: Entity;
  field: keyof Entity;
  eventEmitter?: EventEmitter2;
  error?: Record<string, any>;
  data?: Record<string, any>;
};

export type Options<Entity, Status, Action> = {
  transitions: {
    name: Action | 'init';
    from: Status | Status[] | '*';
    to: Status;
  }[];
  stateField: keyof Entity;
  options?: {
    errorFactory?: ErrorFactory<Entity, Status, Action>;
    afterTransition?: (
      s: HookParam<Entity, Status, Action>,
    ) => void | Promise<void>;
    beforeTransition?: (s: HookParam<Entity, Status, Action>) => boolean;
  };
};

export function StateMachine<Entity, Status, Action>(
  allOptions:
    | Options<Entity, Status, Action>
    | Options<Entity, Status, Action>[],
) {
  if (!Array.isArray(allOptions)) {
    allOptions = [allOptions];
  }

  return function <T extends { new (...args) }>(ctor: T) {
    allOptions.forEach((options) => {
      const afterLoadMethodName = `fsm${camelCase(
        options.stateField.toString(),
        true,
      )}`;
      const load = function (): IStateMachine {
        return StateMachineLoader.load(this, options);
      };

      Object.defineProperty(ctor.prototype, afterLoadMethodName, {
        value: load,
        configurable: true,
      });

      const guardStateMethodName = `${afterLoadMethodName}Guard`;
      const guardState = function () {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const statusValue = this[options.stateField] as string;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const fsm = this[afterLoadMethodName]() as IStateMachine;
        if (statusValue !== fsm?.state) {
          throw new UnprocessableEntityException([
            {
              currentState: fsm.state,
              allowedTransitions: fsm.transitions(),
            },
          ]);
        }
        return statusValue;
      };

      Object.defineProperty(ctor.prototype, guardStateMethodName, {
        value: guardState,
        configurable: true,
      });

      getMetadataArgsStorage().entityListeners.push(
        {
          target: ctor,
          propertyName: afterLoadMethodName,
          type: EventListenerTypes.AFTER_LOAD,
        },
        {
          target: ctor,
          propertyName: afterLoadMethodName,
          type: EventListenerTypes.AFTER_INSERT,
        },
        {
          target: ctor,
          propertyName: guardStateMethodName,
          type: EventListenerTypes.BEFORE_UPDATE,
        },
        {
          target: ctor,
          propertyName: afterLoadMethodName,
          type: EventListenerTypes.AFTER_UPDATE,
        },
        {
          target: ctor,
          propertyName: afterLoadMethodName,
          type: EventListenerTypes.AFTER_RECOVER,
        },
      );
    });
    return ctor;
  };
}
