import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Client, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    controllers: [TasksController],
    providers: [TasksService],
    imports: [
        ClientsModule.register([
            {
                name: 'TASK_SERVICE',
                transport: Transport.NATS,
                options: {
                    // url: 'nats://localhost:4222',
                },
            },
        ]),
    ],
})
export class TasksModule {}
