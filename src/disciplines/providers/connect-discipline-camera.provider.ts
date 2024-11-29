import { Injectable } from '@nestjs/common';
import { ConnectDisciplineCameraDto } from '../dtos/connect-discipline-camera.dto';

@Injectable()
export class ConnectDisciplineCameraProvider {
  constructor() {}

  public async connectDisciplineCamera(
    connectDisciplineCameraDto: ConnectDisciplineCameraDto,
  ) {
    return connectDisciplineCameraDto;
  }
}
