import { IsString, IsEnum, IsOptional, IsNumber, IsUrl } from 'class-validator';

export enum FeedFormat {
  yml = 'yml',
  csv = 'csv',
  json = 'json',
}

export class CreateShopDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsString()
  domain!: string;

  @IsUrl()
  feedUrl!: string;

  @IsEnum(FeedFormat)
  feedFormat!: FeedFormat;

  @IsNumber()
  updateFrequency!: number;

  @IsOptional()
  @IsString()
  paymentDeliveryInfo?: string;

  @IsOptional()
  @IsString()
  subid?: string;

  @IsOptional()
  @IsString()
  admitadToken?: string;
}
