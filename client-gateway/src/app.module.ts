import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { NatsModule } from './transports/nats.module';

@Module({
    imports: [ProjectsModule, TasksModule, NatsModule],
})
export class AppModule {}
