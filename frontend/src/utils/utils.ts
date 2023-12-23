export function formatDateString(dateString: string): string {
  return new Date(dateString).toISOString().split("T")[0];
}

export function getYoutubeVideoId(url: string): string {
  return (
    url.split("watch?v=")[1] ??
    url.split("youtu.be/")[1] ??
    url.split("youtube.com/shorts/")[1] ??
    ""
  );
}

export function getSecondsFromTimestamp(timestamp: string): number {
  const sections = timestamp.split(":");
  let seconds = 0;
  for (let i = 0; i < sections.length; i++) {
    seconds *= 60;
    seconds += +sections[i];
  }
  return seconds;
}

export function getTimestampFromSeconds(totalSeconds: number): string {
  const sec = (totalSeconds % 60).toString().padStart(2, "0");
  const totalMinutes = Math.floor(totalSeconds / 60);
  if (totalMinutes === 0) {
    return `0:${sec}`;
  } else if (totalMinutes < 60) {
    return `${totalMinutes}:${sec}`;
  }
  const min = (totalMinutes % 60).toString().padStart(2, "0");
  const hour = Math.floor(totalMinutes / 60);
  return `${hour}:${min}:${sec}`;
}

function authHeader(): object {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr) {
    user = JSON.parse(userStr);
  }
  if (user && user.jwt) {
    return { Authorization: "Bearer " + user.jwt };
  } else {
    return { Authorization: "" };
  }
}

function updateOptions(options: any) {
  const update = { ...options };
  update.headers = {
    ...update.headers,
    ...authHeader(),
  };
  return update;
}

export function fetcher(url: string, options?: any) {
  return fetch(url, updateOptions(options));
}
