import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	async createUser(name: string):Promise<User> {
		const user = this.create({
			nickname: name
		})
		const result = await this.save(user);

		return (result);
	}
}
