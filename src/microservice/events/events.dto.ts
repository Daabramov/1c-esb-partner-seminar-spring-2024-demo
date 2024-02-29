import { Expose, Transform } from 'class-transformer';
import { IsInt, IsString, Length } from 'class-validator';
import { isNull } from 'util';

export class EventDto {
  @IsString()
  @Length(36)
  @Expose()
  @Transform(({ obj }) => JSON.parse(obj.content).id, {
    toClassOnly: true,
  })
  public readonly id: string;

  @IsString()
  @Expose()
  @Transform(({ obj }) => JSON.parse(obj.content).status, {
    toClassOnly: true,
  })
  public readonly status: string;

  // @IsString()
  @Expose()
  @Transform(({ obj }) => JSON.parse(obj.content).courierName, {
    toClassOnly: true,
  })
  public readonly courierName: string | null;

  constructor(eventData: any) {
    Object.assign(this, eventData);
  }


}
