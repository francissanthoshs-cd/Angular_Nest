import { Body, Controller, Delete, Get, Param, Patch, Post, Put, ValidationPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from 'src/DTO/createTodo.dto';
import { TodoStatus } from 'src/Entity/todo.entity';
import { TodoStatusValidationPipe } from 'src/pipes/TodoStatusValidation.pipe';

@Controller('todos')
export class TodoController {
    constructor(private todoService: TodoService) { }

    @Get()
    getAllTodos() {
        console.log(this.todoService.getAllTodos());
        return this.todoService.getAllTodos();
    }

    @Post()
    createNewTodo(@Body(ValidationPipe) data: CreateTodoDto) {
        const { title, description } = data;
        this.todoService.createTodo(data);
    }

    @Patch(':id')
    updateTodo(
        @Body('status', TodoStatusValidationPipe) status: TodoStatus,
        @Param('id') id: number
    ) {
        return this.todoService.update(id, status);
    }

    @Delete(':id')
    deleteTodo(@Param ('id') id:number){
        return this.todoService.delete(id);
    }
}
