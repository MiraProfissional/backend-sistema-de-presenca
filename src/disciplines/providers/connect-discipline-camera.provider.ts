import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConnectDisciplineCameraDto } from '../dtos/connect-discipline-camera.dto';
import { ConfigType } from '@nestjs/config';
import cameraRouteConfig from '../config/camera-route.config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ConnectDisciplineCameraProvider {
  constructor(
    @Inject(cameraRouteConfig.KEY)
    private readonly cameraConfiguration: ConfigType<typeof cameraRouteConfig>,

    private readonly httpService: HttpService,
  ) {}

  public async connectDisciplineCamera(
    connectDisciplineCameraDto: ConnectDisciplineCameraDto,
  ) {
    const url = this.cameraConfiguration.apiRoute;

    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.get(
          `${url}/chamada/${connectDisciplineCameraDto.timeCameraOn}`,
        ),
      );

      return response.data;
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting with camera API',
      });
    }
  }
}
