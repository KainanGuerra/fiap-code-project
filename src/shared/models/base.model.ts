import {
  Column,
  CreateDateColumn,
  DeepPartial,
  DeleteDateColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel<T> {
  abstract id?: string;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Index()
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  @Index()
  deletedAt?: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  internalComment?: string | null;

  constructor(data?: DeepPartial<T>) {
    Object.assign(this, data);
  }
}
