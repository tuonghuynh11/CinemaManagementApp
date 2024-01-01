export function getDate(rawDate, isLine) {
  try {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    if (isLine) {
      return `${day}/${month}/${year}`;
    }
    return `${day}-${month}-${year}`;
  } catch (error) {
    return;
  }
}
export function getTime(rawDate) {
  try {
    let date = new Date(rawDate);
    let hour = date.getHours();
    let minutes = date.getMinutes();

    let season = hour < 12 ? "AM" : "PM";
    hour = hour < 10 ? `0${hour}` : hour;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour}:${minutes} ${season}`;
  } catch (error) {
    return;
  }
}

export function getDuration(time) {
  try {
    let temp = parseInt(time);
    console.log("hour", parseInt(temp / 60));

    let hour = parseInt(temp / 60);
    let minutes = temp % 60;

    // console.log("hour", hour);
    hour = hour < 10 ? `${hour}` : hour;
    if (minutes === 0) {
      return `${hour}h`;
    }
    return `${hour}h:${minutes}m`;
  } catch (error) {
    return;
  }
}
export function calculateTimeDifference(date1, date2) {
  // Calculate the time difference in milliseconds
  const timeDifferenceMillis = date2 - date1;

  // Calculate hours, minutes, and seconds from milliseconds
  const hours = Math.floor(timeDifferenceMillis / (1000 * 60 * 60));
  const minutes = Math.floor(
    (timeDifferenceMillis % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((timeDifferenceMillis % (1000 * 60)) / 1000);

  // Return the time difference as an object
  if (minutes === 0) return `${hours}h`;
  return `${hours}h${minutes}m`;
}
export function covertDateTimeToString(time) {
  const hours = parseInt(time) / 60;
  const minutes = parseInt(time) % 60;

  // Return the time difference as an object
  return `${hours}h:${minutes < 10 ? "0" + minutes : minutes}m`;
}
export function convertStringDate(timeString) {
  var [hours, minutes] = timeString.split(":");
  var date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  date.setSeconds(0);
  return date;
}
