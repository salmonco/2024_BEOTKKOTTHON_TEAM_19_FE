"use client";
import { useEffect, useState } from "react";
import GrowComponent from "../../components/mainHome/growComponents";
import classes from "./page.module.css";
import CreateHabitComponent from "../../components/mainHome/createHabitComponent";
import NavBar from "../../components/nav/navBar";
import HabitComponent from "../../components/habit/habitComponent";
import useUserInfo from "../../hooks/useUserInfo";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import Encourage from "../../components/encourage";

export default function Home() {
  const [count, setCount] = useState(400);
  const [days, setDays] = useState(158);
  const [habit, setHabit] = useState([]);
  const [tree, setTree] = useState(0);
  const [dayDiff, setDayDiff] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [habitText, setHabitText] = useState("");
  const [level, setLevet] = useState(0);
  // const [user, setUser] = useState("User");
  const { userInfo } = useUserInfo();
  const { feedback, treeId, id, treePostImageUrls } = userInfo;
  const router = useRouter();
  console.log(feedback, treeId);
  const {
    userInfo: { accessToken },
  } = useUserInfo();

  const handleShowHabitDetail = (habitId) => {
    router.push(`/habitDetail?habitId=${habitId}`);
  };

  // useEffect(() => {
  //   // 컴포넌트가 마운트될 때 한 번만 실행됩니다.
  //   setHabit([{ "id": 1, "name": "매일 아침 조깅하기", "progress": 70 }]);
  //   // 다른 로직이나 API 호출 등을 여기에 추가할 수 있습니다.
  // }, []);

  useEffect(() => {
    console.log(`${accessToken}`);
    const handleGetHabit = async () => {
      try {
        const response = await axios.get("/api/trees", {
          headers: { authorization: `Bearer ${accessToken}` },
        });
        if (response.status === 200) {
          setHabit(response.data.data);
          console.log("불러오기 성공");
          console.log(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    handleGetHabit();
  }, [accessToken]);

  const handleShare = () => {
    const shareUrl = `https://want-habit.vercel.app/shareTree?id=${id}`;
    // const shareUrl = `http://localhost:3000/shareTree?id=${id}`;
    console.log(shareUrl);
    copyToClipBoard(shareUrl);
  };

  function copyToClipBoard(shareUrl) {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        console.log("Text copied to clipboard...");
        alert(`${shareUrl} 주소가 복사되었습니다.`);
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  }

  return (
    <div className="h-[100vh] bg-[#EBFAEF] overflow-y-auto">
      <div className="flex flex-col gap-[60px] pt-[21px] pb-[25px] px-[20px] bg-white">
        <div className="flex justify-between relative">
          <p className={classes.userGarden}>
            {userInfo.username || "User"}의 정원
          </p>
          <div className={classes.shareContainer}>
            <div className="cursor-pointer" onClick={handleShare}>
              <p className={classes.shareText}>공유하기</p>
            </div>
            <Image
              src="/image/share.svg"
              alt="shareImg"
              width={16}
              height={14}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[20px]">
          <p className={classes.growRecord}>성장 과정</p>
          <div className={classes.currentBox}>
            <GrowComponent text="연속 성장" countDay={days} order={true} />
            <GrowComponent text="총 인증글 수" num={count} />
          </div>
        </div>
      </div>

      <div className="pt-[17px] pb-[100px] px-[20px]">
        <div className={classes.habitBox}>
          <p className={classes.habitText}>성장 중인 나무 {habit.length}그루</p>
          <div className={classes.habitContainer}>
            {habit.map((data, index) => {
              return (
                <HabitComponent
                  onClick={() => handleShowHabitDetail(data.treeId)}
                  key={index}
                  treeId={data.treeId}
                  habitText={data.habitName}
                  level={data.treeLevel}
                  url={data.treeImageUrl}
                  day={data.continuousPeriod}
                />
              );
            })}
            <Link className="w-full" href="/createHabit">
              <CreateHabitComponent />
            </Link>
          </div>
        </div>
      </div>
      <NavBar />
      {feedback && (
        <Encourage treeId={treeId} treePostImageUrls={treePostImageUrls} />
      )}
    </div>
  );
}
