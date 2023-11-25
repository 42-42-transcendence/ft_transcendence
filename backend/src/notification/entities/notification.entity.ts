import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotiType } from "../enums/noti-type.enum";
import { User } from "src/user/entities/user.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    notiID: string;

    @Column()
    message: string;

    @Column()
    notiType: NotiType;

    @ManyToOne(() => User, (user) => user.notifications, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete'
    })
    user: User;
}