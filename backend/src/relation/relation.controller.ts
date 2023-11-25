import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationDto } from './dto/relation.dto';

@Controller('relation')
export class RelationController {
  constructor(private readonly relationService: RelationService) {}
}
