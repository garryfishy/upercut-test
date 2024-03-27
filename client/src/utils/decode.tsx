import { JwtPayload, jwtDecode } from "jwt-decode";

export function isTokenExpired(token: string) {
  if (!token) {
    return true;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    if (decoded) {
      return decoded.exp! < currentTime;
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;
  }
}
