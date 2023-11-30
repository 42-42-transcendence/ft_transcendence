import { ApiProperty } from "@nestjs/swagger";
import { truncate } from "fs";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auth {

	@ApiProperty({
		description: 'Auth ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
		type: 'string'
	})
	@PrimaryGeneratedColumn('uuid')
	authID: string;

	@ApiProperty({
		description: '인트라 UID',
		example: '12345',
		type: 'string'
	})
	@Column({ nullable: false })
	intraUID: string;

	@ApiProperty({
		description: 'User 외래키',
		example: '550e8400-e29b-41d4-a716-446655440000',
		type: 'Promise<User>',
		nullable: true
	})
	@OneToOne(() => User, (user) => user.auth, {
		nullable: true,
		cascade: true
	})
	@JoinColumn({ referencedColumnName: 'nickname' })
	user: Promise<User>;

}
