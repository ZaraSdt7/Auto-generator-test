import { Controller, Get, Post, Body } from '@nestjs/common';
import { SampleService } from './sample.service';

@Controller('sample')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Get('/')
  getData() {
    return this.sampleService.getData();
  }

  @Post()
  createData( @Body() data: any) {
    return {...data,message:"Sample data successfully created"};
  }
}
