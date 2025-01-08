import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @MessagePattern({ cmd: 'create_project' })
    create(@Payload() createProjectDto: CreateProjectDto) {
        return this.projectsService.create(createProjectDto);
    }

    @MessagePattern({ cmd: 'find_all_projects' })
    findAll(@Payload() paginationDto: PaginationDto) {
        return this.projectsService.findAll( paginationDto);
    }

    @MessagePattern({ cmd: 'find_one_project' })
    findOne(@Payload('id') id: string) {
        return this.projectsService.findOne(id);
    }

    @MessagePattern({ cmd: 'update_project' })
    update(
        @Payload() updateProjectDto: UpdateProjectDto
    ) {
        return this.projectsService.update(updateProjectDto.id, updateProjectDto);
    }

    @MessagePattern({ cmd: 'remove_project' })
    remove(@Payload('id') id: string) {
        return this.projectsService.remove(id);
    }

    @MessagePattern({ cmd: 'validate_project' })
    async validateProject(@Payload('projectId', ParseUUIDPipe) projectId: string) {
        const project = await this.projectsService.findOne(projectId);
        return !!project;
    }
}
