function countryCodeToFlagEmoji(countryCode) {
  const offset = 127397;
  return [...countryCode.toUpperCase()]
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + offset))
    .join('');
}

export default countryCodeToFlagEmoji;
