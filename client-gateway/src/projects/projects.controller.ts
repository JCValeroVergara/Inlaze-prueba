import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProjectDto, UpdateProjectDto } from './dto';


@Controller('projects')
export class ProjectsController {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {}
    
    @Post()
    createProject(@Body() createProjectDto: CreateProjectDto) {
        return this.client.send({ cmd: 'create_project' }, createProjectDto);
    }

    @Get()
    findAllProjects(@Query() paginationDto: PaginationDto) {
        return this.client.send({ cmd: 'find_all_projects' }, paginationDto);
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {

        try {
            const project = await firstValueFrom(
                this.client.send({ cmd: 'find_one_project' }, { id })
            );
            return project;
        } catch (error) {
            throw new RpcException(error);
        }
    }

    @Patch(':id')
    updateProject(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProjectDto: UpdateProjectDto
    ) {
        return this.client.send({ cmd: 'update_project' }, { id, ...updateProjectDto })
        .pipe(
            catchError((error) => {
                throw new RpcException(error);
            })
        );
    }

    @Delete(':id')
    deleteProject(
        @Param('id', ParseUUIDPipe ) id: string
    ) {
        return this.client.send({ cmd: 'remove_project' }, { id })
        .pipe(
            catchError((error) => {
                throw new RpcException(error);
            }),
        );
    }
}
