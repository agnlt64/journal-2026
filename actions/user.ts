// import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user-context";

export async function updateSettings(data: {
  blurLevel?: number;
  itemsPerPage?: number;
  pinCode?: string;
}) {
  // const user = await getOrCreateUser();

  // await db.user.update({
  //   where: { id: user.id },
  //   data: {
  //     blurLevel: data.blurLevel,
  //     itemsPerPage: data.itemsPerPage,
  //     pinCodeHash: data.pinCode,
  //   },
  // });
}

export async function getUserSettings() {
  // const user = await getOrCreateUser();
  // return {
  //   blurLevel: user.blurLevel,
  //   itemsPerPage: user.itemsPerPage,
  //   hasPin: !!user.pinCodeHash,
  // };
}
