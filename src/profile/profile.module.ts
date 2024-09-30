import { Module, forwardRef } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AppModule } from '../app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
