import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { RelationEnum } from '../enums/relation.enum';

@Entity()
export class Relation {
  @PrimaryColumn()
  requestId: number;

  @PrimaryColumn()
  responderId: number;

  @Column({
    type: 'enum',
    enum: RelationEnum,
  })
  relation: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requestId' })
  requester: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'responderId' })
  responder: User;
}
