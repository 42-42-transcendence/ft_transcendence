import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthRepository extends Repository<Auth> {
  constructor(private dataSource: DataSource) {
    super(Auth, dataSource.createEntityManager());
  }

  async getAuthByIntraID(intraUID: string): Promise<Auth> {
    return await this.findOneBy({ intraUID });
  }

  async createAuth(intraUID: string): Promise<Auth> {
    const auth = this.create({
      intraUID: intraUID,
    });
    const result = await this.save(auth);

    return result;
  }

  async relationAuthUser(auth: Auth, user: User): Promise<Auth> {
    auth.user = Promise.resolve(user);
    const result = await this.save(auth);

    return result;
  }
}
