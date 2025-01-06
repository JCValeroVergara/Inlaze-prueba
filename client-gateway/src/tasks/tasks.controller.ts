import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
import { CreateTaskDto, TaskPaginationDto, UpdateTaskDto } from './dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';


@Controller('tasks')
export class TasksController {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {}

    @Post()
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.client.send({ cmd: 'create_task' }, createTaskDto);
    }

    @Get()
    findAll(@Query() taskPaginationDto: TaskPaginationDto) {
        return this.client.send({ cmd: 'find_all_tasks' }, taskPaginationDto);
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        try {
            const task = await firstValueFrom(
                this.client.send({ cmd: 'find_one_task' }, { id })
            );
            return task;
        } catch (error) {
            throw new RpcException(error);
        }
    }

    @Patch(':id')
    updateTask(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateTaskDto: UpdateTaskDto
    ) {
        return this.client.send({ cmd: 'update_task' }, { id, ...updateTaskDto })
        .pipe(
            catchError((error) => {
                throw new RpcException(error);
            })
        );
    }
}
