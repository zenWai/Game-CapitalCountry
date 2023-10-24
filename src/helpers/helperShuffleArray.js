function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // j is an integer between 0 and i inclusive
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default shuffleArray;
