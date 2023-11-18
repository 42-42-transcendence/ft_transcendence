import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { RelationEnum } from '../enums/relation.enum';

@Entity()
export class Relation {

  @PrimaryGeneratedColumn('uuid')
  relationID: string;

  @Column()
  relation: RelationEnum;


  @ManyToOne(() => User, (user) => user.subjectRelations, {
    onDelete: 'CASCADE'
  })
  subjectUser: User;

  @ManyToOne(() => User, (user) => user.objectRelations, {
    onDelete: 'CASCADE'
  })
  objectUser: User;
}
