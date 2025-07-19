import React from "react";
import { useState, useEffect } from "react";
import Slatecards from "./SlateCards";
function Heder() {
  const [restTime, setRestTime] = useState("");
  const [City, setCity] = useState("مكة مكرمة");
  const [nextPray, setnextPray] = useState("الفجر");
  // !  get date
  const todayAr = new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const todayEn = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  //? time rest to the next prayer

  return (
    <div className=" ">
      <div className="parent  grid grid-cols-2   p-[20px] text-center ">
        <div className="resete m-2    !border-[#00A550] border-3 bg-[#F5F5F5] rounded-[8px] border-[#1A1110]  border-[2px]  p-[10px]  ">
          <div>متبقي حتى صلاة {nextPray}</div>
          <div className="text-[#2E8B57]">{restTime}</div>
        </div>
        <div className="!border-[#00A550] border-3  time-place font-bold text-[18px]  bg-[#ACE1AF]  rounded-[8px] border-[#1A1110]  border-[2px]  p-[10px] m-2">
          <div className="font-bold">{City} </div>
          <div>
            {todayAr} <br /> {todayEn}
          </div>
        </div>
      </div>
      <div className="paryers">
        <Slatecards
          setnextPray={setnextPray}
          City={City}
          setCity={setCity}
          restTime={restTime}
          setRestTime={setRestTime}
        />
      </div>
    </div>
  );
}

export default Heder;
