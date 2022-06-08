import axios from "axios";

import api from "./api";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shuffleArray<T>(items: Array<T>): Array<T> {
  const itemsCopy = [...items];

  let currentIndex = itemsCopy.length;
  let randomIndex;

  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [itemsCopy[currentIndex], itemsCopy[randomIndex]] = [
      itemsCopy[randomIndex],
      itemsCopy[currentIndex],
    ];
  }

  return itemsCopy;
}

export async function saveShuffledPlaylist(
  originalList: Array<string>,
  shuffledList: Array<string>,
  playlistId: string
) {
  // Maintain a copy of the area so we're always reordering correctly
  // If we used the original array, the order would be wrong after the update
  const currentOrder = [...originalList];
  let currentSnapshotId = "";

  for (let index = 0; index < shuffledList.length; index++) {
    const currentTrackIndex = currentOrder.findIndex(
      (item) => item === shuffledList[index]
    );
    if (currentTrackIndex === index) continue;

    const makeApiCall = async (): Promise<string> => {
      return api.updatePlaylistTrackPosition({
        playlistId,
        currentPosition: currentTrackIndex,
        newPosition: index === shuffledList.length ? index + 1 : index,
        snapshotId: currentSnapshotId,
      });
    };

    try {
      currentSnapshotId = await makeApiCall();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          const timeout =
            parseInt(err.response.headers["Retry-After"], 10) ?? 5;
          console.log("Backoff timeout");
          await delay(timeout * 1000);
          await makeApiCall();
        }
      }
    }

    currentOrder.splice(currentTrackIndex, 1);
    currentOrder.splice(index, 0, shuffledList[index]);
  }
}
