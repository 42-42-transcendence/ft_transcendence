import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { accessSync } from 'fs';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
	constructor(private userRepository: UserRepository) {}
}
