import Apartment from "../model/Apartment.js";
import User from "../model/User.js";

import {
  fetchReservationId,
  fetchReservationInfo,
} from "./apiintegration/GuestyApi.js";
import fs from "fs";

let guestyAuthKey = fs.readFileSync("./config.js", "utf8");

export const cronWork = async (day) => {
  try {
    const reservationIdList = await fetchReservationId(guestyAuthKey, day);
    // console.log(reservationIdList);
    // fs.writeFileSync(
    //   "./reservation.json",
    //   JSON.stringify(reservationIdList),
    //   (err) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }
    //   }
    // );
    guestyAuthKey = fs.readFileSync("./config.js", "utf8");

    for (let i = 0; i < reservationIdList.length; i++) {
      if (reservationIdList[i].status != "confirmed") continue;
      const reservationInfo = await fetchReservationInfo(
        guestyAuthKey,
        reservationIdList[i]._id
      );
      // fs.writeFileSync("reservation.json", JSON.stringify(reservationInfo));

      //Save in Database
      const findApartment = await Apartment.findOne({
        name: reservationInfo.listing.nickname,
      });
      if (!findApartment) {
        await Apartment.create({
          name: reservationInfo.listing.nickname || "",
          photo: reservationInfo.listing.picture.thumbnail || "",
          address: reservationInfo.listing.address.full || "",
        });
      }
      const findGuest = await User.findOne({
        confirmationCode: reservationInfo.confirmationCode,
      });
      if (!findGuest) {
        await User.create({
          name: reservationInfo.guest.fullName,
          address: reservationInfo.guest.hometown,
          phoneNumber: reservationInfo.guest.phone,
          confirmationCode: reservationInfo.confirmationCode,
          reservationId: reservationInfo._id,
          checkIn: reservationInfo.checkIn.split("T")[0],
          checkOut: reservationInfo.checkOut.split("T")[0],
          role: "user",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
