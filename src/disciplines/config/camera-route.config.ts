import { registerAs } from '@nestjs/config';

export default registerAs('cameraConfig', () => ({
  apiRoute: process.env.CAMERA_ROUTE_API,
}));
