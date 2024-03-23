import {DefectCategory} from '../enums/DefectCategory.ts';

export interface DefectDto {
  id: string;
  description: string;
  location: string;
  dateReported: Date;
  isFixed: boolean;
  defectCategory: DefectCategory;
  imageUrl: string;
}
