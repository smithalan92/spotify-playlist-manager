export function delay(ms: number) {
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
