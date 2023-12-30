import { IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class MeetingCreateDTO {
	@IsNotEmpty()
	@IsString()
	@MaxLength(200)
		detail: string;

	@IsNotEmpty()
	@IsISO8601()
		date: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(8)
  @Max(22)
  	hour: number;

	@IsNotEmpty()
  @IsNumber()
		duration: number;
}

export class MeetingUpdateDTO {
	@IsOptional()
	@IsString()
	@MaxLength(200)
		detail: string;

	@IsOptional()
	@IsISO8601()
		date: Date;
}