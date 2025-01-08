import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';

@Injectable()
export class ProjectsService extends PrismaClient implements OnModuleInit {

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {
        super();
    }

    private readonly logger = new Logger('ProjectsService');
    
    onModuleInit() {
        this.$connect();
        this.logger.log('Connected to the database');
    }
    create(createProjectDto: CreateProjectDto) {
        try {
            return this.project.create({
                data: createProjectDto,
            });
        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }

    async findAll(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        const totalPages = await this.project.count();
        const lastPage = Math.ceil(totalPages / limit);

        return {
            data: await this.project.findMany({
                skip: (page - 1) * limit,
                take: limit,
            }),
            meta: {
                total: totalPages,
                page: page,
                lastPage: lastPage,
            },
        }
    }

    async findOne(id: string) {
        const project = await this.project.findFirst({
            where: { id, active: true },
        });

        if (!project) {
            throw new RpcException({
                message: `Project with id ${id} not found`,
                status: HttpStatus.BAD_REQUEST,
            });
        }

        return project;
    }

    async update(id: string, updateProjectDto: UpdateProjectDto) {

        const { id: _, ...data } = updateProjectDto;

        await this.findOne(id);

        return this.project.update({
            where: { id: id },
            data: data,
        });
    }

    async remove(id: string) {

        await this.findOne(id);

        const project = await this.project.update({
            where: { id: id },
            data: { active: false },
        });

        return project;
    }
}
