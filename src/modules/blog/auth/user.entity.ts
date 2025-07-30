import { IStateMachine } from '@ihelpee/javascript-state-machine';
import { join, map } from 'lodash';
import { Entity, Column, PrimaryColumn, Check } from 'typeorm';

import { generatePgName } from '@Common/generate-pg-name';
import { AuthRoles } from '@Shared/constants/auth.roles.constant';
import { StateMachine } from '@Shared/decorators/state-machine';
import { FsmModel } from '@Shared/models/fsm.model';

import {
  StatusUser,
  StatusUserAction,
  StatusUserActionFns,
} from './costants/status.user';

export interface UserEntity {
  fsmStatus(): IStateMachine & StatusUserActionFns;
}

@StateMachine<UserEntity, StatusUser, StatusUserAction>({
  stateField: 'status',
  transitions: [
    {
      name: StatusUserAction.ENABLE,
      from: [StatusUser.PENDING, StatusUser.INACTIVATED],
      to: StatusUser.ACTIVATED,
    },
    {
      name: StatusUserAction.DISABLE,
      from: [StatusUser.PENDING, StatusUser.ACTIVATED],
      to: StatusUser.INACTIVATED,
    },
  ],
  options: {
    afterTransition: (param) => {
      param.eventEmitter?.emit(
        `user.status.${param.to.toLowerCase()}`,
        param.entity,
      );
    },
  },
})
@Check(
  generatePgName('chk_user_status', StatusUser),
  `status IN (${join(
    map(StatusUser, (v) => `'${v}'`),
    ',',
  )})`,
)
@Entity({ name: 'users', schema: 'blog' })
export class UserEntity extends FsmModel<UserEntity> {
  @PrimaryColumn('varchar', {
    primaryKeyConstraintName: 'pk_user_id',
    default: () => `generate_ulid('usr')`,
  })
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    name: 'status',
    type: 'varchar',
    default: StatusUser,
  })
  status: StatusUser;

  @Column({ default: AuthRoles.student })
  role: AuthRoles;
}
