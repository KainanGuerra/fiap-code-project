import {
  IStateMachine,
  LifecycleContext,
  Options as FSMOptions,
} from '@ihelpee/javascript-state-machine';
import StateMachine from '@ihelpee/javascript-state-machine/dist/umd';
import { UnprocessableEntityException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class StateMachineLoader {
  static load(entity, options): IStateMachine {
    const { transitions, stateField } = options;
    const defaultErrorFactory = (
      entity: string,
      transition: string,
      from: string,
      to: string,
    ) => {
      return new UnprocessableEntityException([
        {
          transition,
          from,
          to,
        },
      ]);
    };
    const errorFactory = options.options.errorFactory || defaultErrorFactory;

    const transitionMethodWrapper =
      (
        stateMachine: IStateMachine & { [method: string]: () => Promise<void> },
        transition: string,
      ) =>
      (eventEmitter?: EventEmitter2, data?: Record<string, unknown>) => {
        const { to } = transitions.find((e) => e.name === transition);
        const from = entity[stateField] as string;
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          stateMachine[transition](eventEmitter, data);

          options?.options?.afterTransition?.({
            from,
            to,
            transition,
            entity,
            field: stateField,
            eventEmitter,
            data,
          });

          return entity;
        } catch {
          throw errorFactory(entity.constructor.name, transition, from, to);
        }
      };

    const guardMethodWrapper =
      (
        stateMachine: IStateMachine & { [method: string]: () => Promise<void> },
        transition: string,
      ) =>
      (
        lifecycle: LifecycleContext,
        eventEmitter?: EventEmitter2,
        data?: Partial<typeof entity>,
      ) => {
        // const { to } = transitions.find((e) => e.name === transition);
        // const from = entity[stateField] as string;
        if (options?.options?.beforeTransition) {
          return options.options.beforeTransition({
            ...lifecycle,
            entity,
            field: stateField,
            eventEmitter,
            data,
          });
        }
        return true;
      };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const stateMachine = new StateMachine(<FSMOptions>{
      data: {
        entity,
      },
      init: entity[stateField],
      transitions,
      methods: {
        onTransition(lifecycle: LifecycleContext): void {
          if (lifecycle.event !== 'init') {
            Object.assign(entity, { [stateField]: lifecycle.to });
          }
        },
      },
    }) as IStateMachine;

    const stateMachineClone = <IStateMachine>{ ...stateMachine };

    // wrap all transition methods for better error handling
    transitions
      .map((t) => t.name)
      .forEach((transition: string) => {
        stateMachine[transition] = transitionMethodWrapper(
          stateMachineClone,
          transition,
        );
        stateMachine[stateMachine._fsm.config.lifecycle.onBefore[transition]] =
          guardMethodWrapper(stateMachineClone, transition);
      });
    return stateMachine;
  }
}
