export class BaseOutput<T> {
  data: T | T[];
  statusCode: 200;
  status: 'success';
  message: string;
  constructor(data: T | T[], message: string) {
    this.data = data;
    this.statusCode = 200;
    this.status = 'success';
    this.message = message;
  }
}
