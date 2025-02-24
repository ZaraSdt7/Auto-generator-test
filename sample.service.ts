import { Injectable } from '@nestjs/common';

@Injectable()
export class SampleService {
  private data: any[] = [];

  getData() {
    return this.data;
  }

  createData(data: any) {
    this.data.push(data);
    return data;
  }
}
