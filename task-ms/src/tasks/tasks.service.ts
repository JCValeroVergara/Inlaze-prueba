import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateTaskDto, TaskPaginationDto, UpdateTaskDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';

@Injectable()
export class TasksService extends PrismaClient implements OnModuleInit {

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) { 
        super();
    }

    private readonly logger = new Logger('TasksService');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    private async validateProject(projectId: string) {
        const IsValidProject = await this.client
            .send({ cmd: 'validate_project' }, { projectId })
            .toPromise();
        
        if (!IsValidProject) {
            throw new RpcException({
                status: HttpStatus.NOT_FOUND,
                message: `Project with id ${projectId} not found`
            });
        }
    }


    async create(createTaskDto: CreateTaskDto) {
        await this.validateProject(createTaskDto.projectId);

        return this.task.create({
            data: createTaskDto
        });
    }

    async findAll(taskPaginationDto: TaskPaginationDto) {
        
        const totalPages = await this.task.count({
            where: {
                status: taskPaginationDto.status,
                projectId: taskPaginationDto.projectId
            }
        });

        const currentPage = taskPaginationDto.page;
        const perPage = taskPaginationDto.limit;

        return {
            data: await this.task.findMany({
                skip: (currentPage - 1) * perPage,
                take: perPage,
                where: {
                    status: taskPaginationDto.status,
                    projectId: taskPaginationDto.projectId
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
