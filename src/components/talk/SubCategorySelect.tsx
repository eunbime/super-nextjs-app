"use client";

import { Subcategory } from "@prisma/client";
import Dropdown from "../common/Dropdown";

interface SubCategorySelectProps {
  subCategories?: Subcategory[];
  subCategory?: string;
  setSubCategory?: (subcategory: string) => void;
  savedSubCategory?: string;
}

const SubCategorySelect = ({
  subCategories,
  setSubCategory = () => {},
  subCategory,
  savedSubCategory,
}: SubCategorySelectProps) => {
  const handleSelect = (option: string) => {
    setSubCategory(option);
  };

  return (
    <Dropdown
      options={subCategories?.map(
        (subcategory: Subcategory) => subcategory.name
      )}
      selectedOption={subCategory || savedSubCategory || "전체"}
      onSelect={handleSelect}
    />
  );
};

export default SubCategorySelect;
