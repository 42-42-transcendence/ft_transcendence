import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auth {

	@PrimaryGeneratedColumn('uuid')
	authID: string;

	@Column({ nullable: false })
	intraUID: string;

	@OneToOne(() => User, { nullable: true, eager: true })
	@JoinColumn({ referencedColumnName: 'userID' })
	userFK: User;

}
