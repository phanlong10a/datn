import { IsString } from "class-validator";

export class CreateDepartmentInput {
  @IsString()
  name: string
}
