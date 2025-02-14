import { User } from "@prisma/client";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  mobile?: boolean;
  currentUser?: User | null;
}

const NavItem = ({ mobile, currentUser }: NavItemProps) => {
  const pathname = usePathname();
  const isWritePage = pathname?.includes("/write");
  const isUploadPage = pathname?.includes("/upload");

  if (isWritePage || isUploadPage) return null;

  return (
    <ul
      className={`text-md justify-center flex gap-4 w-full items-center ${
        mobile && "flex-col h-full"
      }`}
    >
      <li className="py-2 text-center border-b-4 hover:border-[#0d0c8f] cursor-pointer transition-all duration-300">
        <Link href={"/user/favorites"}>관심</Link>
      </li>
      <li className="py-2 text-center border-b-4 hover:border-[#0d0c8f] cursor-pointer transition-all duration-300">
        <Link href={"/chat"}>채팅</Link>
      </li>
      <li className="py-2 text-center border-b-4 hover:border-[#0d0c8f] cursor-pointer transition-all duration-300">
        <Link href={"/user/profile"}>마이페이지</Link>
      </li>

      {currentUser ? (
        <li className="py-2 text-center border-b-4 hover:border-[#0d0c8f] cursor-pointer transition-all duration-300">
          <button onClick={() => signOut()}>로그아웃</button>
        </li>
      ) : (
        <li className="py-2 text-center border-b-4 hover:border-[#0d0c8f] cursor-pointer transition-all duration-300">
          <button onClick={() => signIn()}>로그인</button>
        </li>
      )}
    </ul>
  );
};

export default NavItem;
