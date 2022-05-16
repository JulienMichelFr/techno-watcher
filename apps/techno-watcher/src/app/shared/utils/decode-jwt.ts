export type DecodedToken = {
  exp: number;
  id: number;
  username: string;
};

export function decodeJwt(jwt: string): DecodedToken {
  const base64Url: string = jwt.split('.')[1];
  const base64: string = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}
