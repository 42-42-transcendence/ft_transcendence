import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Channel } from '../../channel/entities/channel.entity';

@Entity()
export class Chat {

  @PrimaryGeneratedColumn('uuid')
  chatID: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  // unique 하지 않으면 referencedColumnName을 지정할 수 없다
  @ManyToOne(() => User, (user) => user.chats)
  @JoinColumn({ referencedColumnName: 'nickname' })
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.chats)
  channel: Channel;  
}
