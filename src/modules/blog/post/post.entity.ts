import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { MetadataModel } from '@Shared/models/metadata.model';

import { UserEntity } from '../auth/user.entity';

@Entity({ name: 'posts', schema: 'blog' })
export class PostEntity extends MetadataModel<PostEntity> {
  @PrimaryColumn('varchar', {
    primaryKeyConstraintName: 'pk_post_id',
    default: () => `generate_ulid('pst')`,
  })
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @JoinColumn({
    foreignKeyConstraintName: 'fk_post_id_user_id',
  })
  user: UserEntity;
}
