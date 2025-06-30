import { Column } from 'typeorm';

import { MetadataModel } from '@Shared/models/metadata.model';

export interface IFsmEventInterface {
  transition?: string;
  from?: string;
  to: string;
  timestamp: Date;
  user?: string;
  reason?: string;
}
export abstract class FsmModel<T> extends MetadataModel<T> {
  @Column({ type: 'jsonb', nullable: true })
  fsmEvents: Record<string, IFsmEventInterface[]>;
}
