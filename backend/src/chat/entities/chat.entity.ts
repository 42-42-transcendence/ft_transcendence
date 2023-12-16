import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Channel } from '../../channel/entities/channel.entity';
import { ChatType } from '../enums/chat-type.enum';

@Entity()
export class Chat {

  @PrimaryGeneratedColumn('uuid')
  chatID: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  content: string;

  @Column()
  chatType: ChatType

  @Column()
  userNickname: string;


  // unique 하지 않으면 referencedColumnName을 지정할 수 없다
  @ManyToOne(() => User, (user) => user.chats)
  @JoinColumn({ referencedColumnName: 'nickname' })
  user: User;

  // orphanedRowAction이 부모가 삭제 될 때, 자식도 삭제하게 한다.
  // onDelete CASCADE 옵션도 반드시 있어야한다.
  @ManyToOne(() => Channel, (channel) => channel.chats, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  @JoinColumn()
  channel: Channel;
}
