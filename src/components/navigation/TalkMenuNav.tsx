import Link from "next/link";

import { TCategoryWithSubcategories } from "@/types";
import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import { getCategories } from "@/hooks/talk/useCategories";

const TalkMenuNav = async () => {
  const categories: TCategoryWithSubcategories[] = await getCategories();

  return (
    <div className="w-full min-w-[200px] lg:w-[20%] h-full lg:block hidden">
      <nav className="flex flex-col gap-4 bg-gray-100 py-5 px-7 rounded-md">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col gap-2">
            <Link
              href={`/talk?category=${category.name}`}
              className="text-lg font-bold"
            >
              {CATEGORY_TITLE[category.name as CategoryType]}
            </Link>
            <div className="flex flex-col gap-1">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/talk?category=${category.name}&subcategory=${subcategory.name}`}
                  className="text-sm text-gray-500 hover:text-gray-700 pl-1"
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default TalkMenuNav;
