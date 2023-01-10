import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as NodeGeocoder from 'node-geocoder';

export interface IsyncDataLocation {
  district: string;
  province: string;
}
@Injectable()
export class GoogleMapService {
  private api_key: string;
  constructor(private readonly config: ConfigService) {
    this.api_key = this.config.get<string>('google_map_api_key');
  }
  async getLocationInfo(lat: number, long: number): Promise<string> {
    const options: any = {
      provider: 'google',
      apiKey: this.api_key,
      formatter: null,
      limit: 10000,
    };
    const geocoder = NodeGeocoder(options);
    try {
      const res = await geocoder.reverse({ lat, lon: long });
      if (!!res) {
        return res[0].formattedAddress as string;
      }
      return 'Địa điểm chưa xác minh';
    } catch (error) {
      return 'Địa điểm chưa xác minh';
    }
  }
}
