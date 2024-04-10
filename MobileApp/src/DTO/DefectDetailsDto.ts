import {DefectCategory} from '../enums/DefectCategory.ts';

export interface DefectDetailsDto {
  id: string;
  description: string;
  location: string;
  locationName: string;
  dateReported: Date;
  isFixed: boolean;
  defectCategory: DefectCategory;
  imageUrl: string;
}
