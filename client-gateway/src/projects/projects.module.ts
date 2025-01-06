import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
    controllers: [ProjectsController],
    providers: [],
    imports: [NatsModule]
})
export class ProjectsModule {}
