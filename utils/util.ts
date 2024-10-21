
export function getCookie(key: string) {
  const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

export function getAuthToken() {
  const storedData = localStorage.getItem('user');
  const parsedData = JSON.parse(storedData!);
  if(parsedData === null) return null;
  const token = parsedData.token;
  if(token) return token;
  return null;
}


