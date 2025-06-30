import { Column } from 'typeorm';

import { BaseModel } from '@Shared/models/base.model';

export abstract class MetadataModel<T> extends BaseModel<T> {
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;
}
