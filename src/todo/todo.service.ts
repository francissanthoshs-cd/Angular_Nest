import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from 'src/DTO/createTodo.dto';
import { TodoEntity, TodoStatus } from 'src/Entity/todo.entity';
import { Repository } from 'typeorm';
@Injectable()
export class TodoService {
    constructor(@InjectRepository(TodoEntity) private repo: Repository<TodoEntity>) { }

    async getAllTodos(): Promise<TodoEntity[]> {
        return await this.repo.find();
    }

    async createTodo(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const todo = new TodoEntity();
        const { title, description } = createTodoDto;
        todo.title = title;
        todo.description = description;
        todo.status = TodoStatus.OPEN;
        this.repo.create(todo);
        try {
            return await this.repo.save(todo);
        } catch (err) {
            throw new InternalServerErrorException('Something Went Wrong.....')
        }
    }

    async update(id: number, status: TodoStatus): Promise<TodoEntity> {
        try {
            await this.repo.update({ id }, { status });
            return this.repo.findOneBy({ id });
        } catch (err) {
            throw new InternalServerErrorException('Something Went Wrong...')
        }
    }

    async delete(id: number) {
        try {
            return await this.repo.delete({ id });
        } catch (err) {
            throw new InternalServerErrorException('Something Went Wrong...')
        }
    }

}
