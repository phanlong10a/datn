import { IsString } from "class-validator";

export class CreatePolicyDto {
  @IsString()
  title: string

  @IsString()
  content: string
}
