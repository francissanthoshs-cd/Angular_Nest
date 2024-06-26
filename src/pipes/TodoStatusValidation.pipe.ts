import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TodoStatus } from "src/Entity/todo.entity";

export class TodoStatusValidationPipe implements PipeTransform {

    readonly allowedStatus = [TodoStatus.OPEN, TodoStatus.WIP, TodoStatus.COMPLETED];
    
    transform(value: any, metadata: ArgumentMetadata): any {
        if (!value) {
            throw new BadRequestException('Status value is empty or undefined.');
        }

        // Ensure value is converted to string and then to uppercase
        const status = String(value).toUpperCase();

        if (!this.isStatusValid(status)) {
            throw new BadRequestException(`${status} is an invalid Status.`);
        }
        return status as TodoStatus;
    }

    private isStatusValid(status: string) {
        return this.allowedStatus.includes(status as TodoStatus);
    }

}
