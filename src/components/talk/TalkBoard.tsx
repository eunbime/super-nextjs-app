import BoardFilter from "./BoardFilter";
import BoardList from "./BoardList";
import PaginationWrapper from "./PaginationWrapper";

const TalkBoard = () => {
  return (
    <div className="w-[80%] h-full rounded-md">
      <BoardFilter />
      <div className="flex w-full items-center justify-between p-4 text-gray-600 border-b-2 border-gray-200">
        <div className="flex gap-10">
          <p className="w-[200px]">카테고리 / 서브카테고리</p>
          <p>제목</p>
        </div>
        <div className="flex gap-5">
          <p>작성자</p>
          <p>작성일</p>
          <p>조회수</p>
          <p>좋아요</p>
        </div>
      </div>
      <BoardList />
      <PaginationWrapper />
    </div>
  );
};

export default TalkBoard;
