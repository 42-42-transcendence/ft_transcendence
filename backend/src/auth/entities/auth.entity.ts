import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auth {
	@PrimaryGeneratedColumn()
	authID: number;

	@Column({ nullable: false })
	intraUID: string;

	@OneToOne(() => User, { nullable: true })
	@JoinColumn({ referencedColumnName: 'userID' })
	user: User;
}
