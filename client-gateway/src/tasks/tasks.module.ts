import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
    controllers: [TasksController],
    providers: [],
    imports: [
            NatsModule
        ]
})
export class TasksModule {}
