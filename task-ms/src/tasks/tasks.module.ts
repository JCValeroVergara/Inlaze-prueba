import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config';

@Module({
    controllers: [TasksController],
    providers: [TasksService],
    imports: [
        ClientsModule.register([
            {
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: envs.natsService,
                },
            },
        ]),
    ],
})
export class TasksModule {}
