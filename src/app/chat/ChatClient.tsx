"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@prisma/client";
import Chat from "@/components/chat/Chat";
import { TUserWithChat } from "@/types/index";

import Contacts from "@/components/chat/Contacts";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import { RotatingLines } from "react-loader-spinner";

interface ChatClientProps {
  currentUser?: User | null;
}

const ChatClient = ({ currentUser }: ChatClientProps) => {
  const searchParams = useSearchParams();
  const [receiver, setReceiver] = useState({
    receiverId: "",
    receiverName: "",
    receiverImage: "",
  });
  const [layout, setLayout] = useState(false);

  useEffect(() => {
    // URL 파라미터에서 채팅 정보 가져오기
    const id = searchParams?.get("id");
    const name = searchParams?.get("name");
    const open = searchParams?.get("open");
    const image = searchParams?.get("image");

    // 파라미터가 있으면 채팅창 열기
    if (id && name) {
      setReceiver({
        receiverId: id,
        receiverName: name,
        receiverImage: image || "",
      });

      if (open === "true") {
        setLayout(true);
      }
    }
  }, [searchParams]);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/chat`);
      return data;
    },
  });

  const currentUserWithMessage = users?.find(
    (user: TUserWithChat) => user.email === currentUser?.email
  );

  if (isLoading) {
    return (
      <div className="min-h-screen -mt-12 w-full flex flex-col gap-2 items-center justify-center">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="30"
          visible={true}
        />
        <p>채팅을 불러오는 중입니다</p>
      </div>
    );
  }
  if (error) return <p>Error!!!</p>;

  return (
    <main>
      <div className="grid grid-cols-[1fr] md:grid-cols-[300px_1fr]">
        <section className={`md:flex ${layout && "hidden"}`}>
          <Contacts
            users={users}
            currentUser={currentUserWithMessage}
            setLayout={setLayout}
            setReceiver={setReceiver}
          />
        </section>
        <section className={`md:flex ${!layout && "hidden"}`}>
          <Chat
            currentUser={currentUserWithMessage}
            receiver={receiver}
            setLayout={setLayout}
          />
        </section>
      </div>
    </main>
  );
};

export default ChatClient;
