import {
  Category,
  Like,
  Message,
  Product,
  Subcategory,
  User,
} from "@prisma/client";

export type TUserWithChat = User & {
  conversations: TConversation[];
};

export type TConversation = {
  id: string;
  messages: Message[];
  users: User[];
};

export type TProductWithCategory = Product & {
  category: Category;
};

export type TLikeWithProduct = Like & {
  product: TProductWithCategory & {
    category: Category;
  };
};

export type TCategoryWithSubcategories = Category & {
  subcategories: Subcategory[];
};
