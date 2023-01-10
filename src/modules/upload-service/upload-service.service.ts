import {
  Injectable
} from '@nestjs/common';


interface IFormatFile {
  id: string,
  name: string,
  description: string,
  total: any,
  time: string,
  md5hash: string,
  external_url: string,
  image: string,
  avgReleaseTokenEveryDay: any,
  totalReleaseToken: any,
  releaseTokenToday: any,
}
@Injectable()
export class UploadServiceService {
  constructor(
  ) { }

}
