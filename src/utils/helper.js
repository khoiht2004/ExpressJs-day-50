const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = "";
  if (hours > 0) {
    result += `${hours} giờ `;
  }
  if (minutes > 0) {
    result += `${minutes} phút`;
  }

  return result.trim() || "0 phút";
};

module.exports = {
  formatTime,
};
