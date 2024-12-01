import { Inject, Injectable } from '@nestjs/common';
import { ConnectDisciplineCameraDto } from '../dtos/connect-discipline-camera.dto';
import { ConfigType } from '@nestjs/config';
import cameraRouteConfig from '../config/camera-route.config';

@Injectable()
export class ConnectDisciplineCameraProvider {
  constructor(
    @Inject(cameraRouteConfig.KEY)
    private readonly cameraConfiguration: ConfigType<typeof cameraRouteConfig>,
  ) {}

  public async connectDisciplineCamera(
    connectDisciplineCameraDto: ConnectDisciplineCameraDto,
  ) {
    return this.cameraConfiguration;
  }
}
