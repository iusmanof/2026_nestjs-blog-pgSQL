import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeGeneratorService {
  generateNumericCode(length: number): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }
}
