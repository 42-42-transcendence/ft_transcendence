import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect, Query, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import axios from 'axios';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
