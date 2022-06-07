import api from "./api";

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

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(500);
    currentSnapshotId = await api.updatePlaylistTrackPosition({
      playlistId,
      currentPosition: currentTrackIndex,
      newPosition: index === shuffledList.length ? index + 1 : index,
      snapshotId: currentSnapshotId,
    });

    currentOrder.splice(currentTrackIndex, 1);
    currentOrder.splice(index, 0, shuffledList[index]);
  }
}
