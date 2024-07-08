import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from 'src/DTO/createTodo.dto';
import { TodoEntity, TodoStatus } from 'src/Entity/todo.entity';
import { UserEntity } from 'src/Entity/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity) private repo: Repository<TodoEntity>,
  ) {}

  async getAllTodos(user: UserEntity) {
    const query = await this.repo.createQueryBuilder('todo');
    query.where(`todo.userId = :userId`, { userId: user.id });
    try {
      return await query.getMany();
    } catch (err) {
      throw new InternalServerErrorException('No To-Do Lists Found');
    }
  }

  async createTodo(createTodoDto: CreateTodoDto, user: UserEntity) {
    const todo = new TodoEntity();
    const { title, description } = createTodoDto;
    todo.title = title;
    todo.description = description;
    todo.status = TodoStatus.OPEN;
    todo.userId = user.id;

    this.repo.create(todo);
    try {
      return await this.repo.save(todo);
    } catch (err) {
      throw new InternalServerErrorException('Something Went Wrong.....');
    }
  }

  async update(id: number, status: TodoStatus, user: UserEntity) {
    try {
      await this.repo.update({ id, userId: user.id }, {
        status,
      } as Partial<TodoEntity>);
      return this.repo.findOneBy({ id });
    } catch (err) {
      throw new InternalServerErrorException('Something Went Wrong...');
    }
  }

  async delete(id: number, user: UserEntity) {
    const result = await this.repo.delete({ id, userId: user.id });
    if (result.affected == 0)
      throw new NotFoundException('Todo List Not Deleted');
    else return { success: true };
  }
}
