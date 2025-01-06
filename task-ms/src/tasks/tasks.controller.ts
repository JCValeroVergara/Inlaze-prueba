import { Controller, NotImplementedException, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskDto, TaskPaginationDto, UpdateTaskDto } from './dto';


@Controller()
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @MessagePattern({ cmd: 'create_task' })
    create(@Payload() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto);
    }

    @MessagePattern({ cmd: 'find_all_tasks' })
    findAll(@Payload() taskPaginationDto: TaskPaginationDto) {
        return this.tasksService.findAll(taskPaginationDto);
    }

    @MessagePattern({ cmd: 'find_one_task' })
    findOne(@Payload('id', ParseUUIDPipe) id: string) {
        return this.tasksService.findOne(id);
    }

    @MessagePattern({ cmd: 'update_task' })
    update(
        @Payload() updateTaskDto: UpdateTaskDto
    ) {
        return this.tasksService.update(updateTaskDto.id, updateTaskDto);
    }
}
