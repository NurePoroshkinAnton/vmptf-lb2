import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { configService } from 'src/utlis/ConfigService';

@Injectable()
export class CdnService {
  async getById(
    id: string,
    userId: string,
    range: { start?: number; end?: number } = {},
  ) {
    const userDir = this.getUserDir(userId);
    const fileName = await this.getFileById(id, userDir);
    const stats = await fs.promises.stat(path.join(userDir, fileName));
    const { start, end } = range;

    return {
      name: fileName,
      stream: fs.createReadStream(path.join(userDir, fileName), { start, end }),
      size: stats.size,
    };
  }

  async remove(id: string, userId: string) {
    const userDir = this.getUserDir(userId);
    const fileName = await this.getFileById(id, userDir);
    await fs.promises.unlink(path.join(userDir, fileName));
  }

  private async getFileById(id: string, directory: string) {
    try {
      const files = await fs.promises.readdir(directory);

      for (const fileName of files) {
        if (
          fileName.startsWith(id + configService.get('UPLOAD_ID_SEPARATOR'))
        ) {
          return fileName;
        }
      }
    } catch (error) {
      throw new NotFoundException('Requested file does not exist');
    }

    throw new NotFoundException('Requested file does not exist');
  }

  private getUserDir(userId: string) {
    return path.join(
      process.cwd(),
      `${configService.get('UPLOADS_DIR')}/${userId}`,
    );
  }
}
