import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect, Query, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import axios from 'axios';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('oauth')
  async foo(@Query('code') code) {
    const client_id = 'u-s4t2ud-ac0f3dd15a318d5c98a08b569824f1d0fccab6cc303a7cd7c0f977b3370ab2e7';
    const client_secret = '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';
    const grant_type = 'authorization_code';
    const redirect_uri = 'http://localhost:3000/api/user/oauth';
    console.log('code!!!', code);

    const url = 'https://api.intra.42.fr/oauth/token';
    const data = { code, grant_type, client_id, client_secret, redirect_uri };

    try {
      const response = await axios.post(url, data);
      if (response.status === HttpStatus.OK) {
        console.log(response.data.access_token);
      }
    } catch (e) {
      console.log('asdf', e);
    }
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
