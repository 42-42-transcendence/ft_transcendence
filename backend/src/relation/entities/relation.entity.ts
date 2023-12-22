import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { RelationTypeEnum } from '../enums/relation-type.enum';

@Entity()
export class Relation {
  @PrimaryGeneratedColumn('uuid')
  relationID: string;

  @Column()
  relationType: RelationTypeEnum;

  @ManyToOne(() => User, (user) => user.subjectRelations, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  subjectUser: User;

  @ManyToOne(() => User, (user) => user.objectRelations, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  objectUser: User;
}
