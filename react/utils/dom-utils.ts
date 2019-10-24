export function getCookie(name: string): string | null {
  const regex = new RegExp(`(^|;)[ ]*${name}=([^;]*)`);
  const match = regex.exec(document.cookie);

  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(
  key: string,
  value: string,
  ttl?: number,
  path: string = "/",
) {
  let expires: string = "";

  if (ttl && ttl > 0) {
    const expirationDate = new Date();
    expirationDate.setTime(new Date().getTime() + ttl);
    expires = `expires=${expirationDate.toUTCString()};`;
  }

  document.cookie = `${key}=${encodeURIComponent(
    value,
  )};${expires}path=${path}`;
}
