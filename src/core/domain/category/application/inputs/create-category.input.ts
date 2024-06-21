import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

type inputConstructorProps = {
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(props: inputConstructorProps) {
    if (!props) return;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive;
  }
}
