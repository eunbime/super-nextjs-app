import { Subcategory } from "@prisma/client";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

interface SideBarSubCategoriesProps {
  subCategories: Subcategory[] | undefined;
  category: string;
  isLoading: boolean;
}

const SideBarSubCategories = ({
  subCategories = [],
  category,
  isLoading,
}: SideBarSubCategoriesProps) => {
  if (isLoading) {
    return (
      <div className="flex gap-2 mt-1 md:mt-5 ml-2 md:flex-col w-full justify-start overflow-x-scroll md:overflow-x-auto">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-[30px] md:h-[20px] w-[90px] rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <ul className="flex gap-2 mt-1 md:mt-5 ml-2 md:flex-col w-full justify-start overflow-x-scroll md:overflow-x-auto">
      {subCategories?.map((subCategory: Subcategory) => (
        <li
          key={subCategory.id}
          className="bg-gray-200 md:bg-transparent py-1 px-3 md:py-0 md:px-0 rounded-full md:rounded-none md:text-sm min-w-fit hover:text-gray-500 transition-all"
        >
          <Link href={`/?category=${category}&subcategory=${subCategory.id}`}>
            {subCategory.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SideBarSubCategories;
