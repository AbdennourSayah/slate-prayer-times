import React, { useEffect, useState } from "react";
import axios from "axios";

function Slatecards({ restTime, setRestTime, City, setCity, setnextPray }) {
  const [TimeZone, setTimeZone] = useState("");

  const [prayers, setPrayers] = useState([
    { name: "الفجر", time: "00:00", img: "img/فجر.jpg", LeftTime: false },
    { name: "الظهر", time: "00:00", img: "img/الظهر.jpg", LeftTime: false },
    { name: "العصر", time: "00:00", img: "img/عصر.jpg", LeftTime: false },
    { name: "المغرب", time: "00:00", img: "img/المغرب.jpg", LeftTime: false },
    { name: "العشاء", time: "00:00", img: "img/عشاء.jpg", LeftTime: false },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch prayer times from API
  const fetchPrayerTimes = async (selectedCity) => {
    setLoading(true);
    setError(null);
    const API_URL = `http://api.aladhan.com/v1/timingsByCity?city=${selectedCity}&country=Saudi%20Arabia`;
    console.log(selectedCity);
    try {
      const response = await axios.get(API_URL);
      const timings = response.data.data.timings;
      const timeZone = response.data.data.meta.timezone;
      console.log("Timezone:", timeZone); // Debugging line to check if timezone is correct
      setTimeZone(timeZone);

      setPrayers((prevPrayers) =>
        prevPrayers.map((prayer) => ({
          ...prayer,
          time: timings[
            prayer.name === "الفجر"
              ? "Fajr"
              : prayer.name === "الظهر"
              ? "Dhuhr"
              : prayer.name === "العصر"
              ? "Asr"
              : prayer.name === "المغرب"
              ? "Maghrib"
              : "Isha"
          ],
        }))
      );
    } catch (err) {
      console.log(err);
      // setError("Failed to fetch prayer times. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const getTimeOfZone = (timeZone) => {
    try {
      if (!timeZone) {
        throw new Error("Timezone is missing.");
      }

      const now = new Date();
      // Use Intl.DateTimeFormat to get the time in the given timezone
      const currentTime = new Intl.DateTimeFormat("en-US", {
        timeZone: timeZone,
        timeStyle: "medium",
        hour12: true,
      }).format(now);

      return currentTime;
    } catch (error) {
      console.error("Error with TimeZone:", error.message);
      return null;
    }
  };

  const checkLeftTime = () => {
    console.log("Timezone:", TimeZone);
    const currentTime = getTimeOfZone(TimeZone); // Get the current time in the timezone
    console.log("Current time:", currentTime);

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < prayers.length; i++) {
      const [hours, minutes] = prayers[i].time.split(":").map(Number);
      const prayerMinutes = hours * 60 + minutes;

      const nextPrayerIndex = (i + 1) % prayers.length;
      const [nextHours, nextMinutes] = prayers[nextPrayerIndex].time
        .split(":")
        .map(Number);
      const nextPrayerMinutes = nextHours * 60 + nextMinutes;

      if (
        currentMinutes >= prayerMinutes &&
        currentMinutes < nextPrayerMinutes
      ) {
        setnextPray(prayers[nextPrayerIndex].name);
        let diffMinutes = nextPrayerMinutes - currentMinutes;
        if (diffMinutes < 0) diffMinutes += 1440; // Adjust for 24-hour wrap-around

        const hoursLeft = Math.floor(diffMinutes / 60);
        const minutesLeft = diffMinutes % 60;

        setRestTime(`Hours: ${hoursLeft}, Minutes: ${minutesLeft}`);
        break;
      }
    }
  };

  useEffect(() => {
    fetchPrayerTimes(City);
  }, [City]);

  useEffect(() => {
    checkLeftTime();
  }, [prayers]);

  return (
    <>
      <div className="flex flex-wrap justify-center items-center gap-6 p-6">
        {prayers.map((prayer, index) => (
          <div
            key={index}
            className=" !border-[#00A550] border-3  w-[200px]  bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out overflow-hidden">
            <img
              src={prayer.img}
              alt={prayer.name}
              className="w-full h-[150px] object-cover"
            />
            <div className="p-4 text-center">
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                {prayer.name}
              </h1>
              <p className="text-gray-600 text-lg">{prayer.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className=" !border-[#00A550] border-3  flex justify-center mt-6">
        <select
          onChange={(e) => {
            setCity(e.target.value);
            console.log(e.target.value);
          }}
          className="w-[250px]  !border-[#00A550] border-5 p-3 border border-gray-300 rounded-lg text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
          <option value="Makkah al Mukarramah">مكة مكرمة</option>
          <option value="مدينة المنورة">مدينة المنورة</option>
          <option value="القدس">القدس</option>
          <option value="الرياض">الرياض</option>
        </select>
      </div>
    </>
  );
}

export default Slatecards;
