export const getColor = (index: number) => {
  switch (index) {
    case 0:
      return "#FFB6C1"; // Light Pink
    case 1:
      return "#FFEB3B"; // Light Yellow
    case 2:
      return "#8BC34A"; // Light Green
    case 3:
      return "#00BCD4"; // Light Cyan
    case 4:
      return "#FF9800"; // Light Orange
    case 5:
      return "#9C27B0"; // Light Purple
    case 6:
      return "#FF5722"; // Light Red-Orange
    case 7:
      return "#00FF7F"; // Light Spring Green
    default:
      return "#000000"; // Default black
  }
};
