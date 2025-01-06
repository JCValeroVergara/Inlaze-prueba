import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateTaskDto, TaskPaginationDto, UpdateTaskDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TasksService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('TasksService');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }
    create(createTaskDto: CreateTaskDto) {
        return this.task.create({
            data: createTaskDto
        });
    }

    async findAll(taskPaginationDto: TaskPaginationDto) {
        
        const totalPages = await this.task.count({
            where: {
                status: taskPaginationDto.status
            }
        });

        const currentPage = taskPaginationDto.page;
        const perPage = taskPaginationDto.limit;

        return {
            data: await this.task.findMany({
                skip: (currentPage - 1) * perPage,
                take: perPage,
                where: {
                    status: taskPaginationDto.status
                }
            }),
            meta: {
                total: totalPages,
                page: currentPage,
                lastPage: Math.ceil(totalPages / perPage)
            }
        };
    }

    async findOne(id: string) {

        const task = await this.task.findFirst({
            where: { id }
        });

        if (!task) {
            throw new RpcException({
                status: HttpStatus.NOT_FOUND,
                message: `Task with id ${id} not found`
            })
        }

        return task;
    }

    async update(id: string, updateTaskDto: UpdateTaskDto) {

        const { id: _, ...data } = updateTaskDto;

        await this.findOne(id);

        return this.task.update({
            where: { id: id },
            data: data
        });
    }
}
