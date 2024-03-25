import jwt from "jsonwebtoken";

export enum UserRole {
  USER = "user",
  COMPANY = "company",
}

export default class JwtHelper {
  private static readonly secretKey: string = "upercut";

  static generateToken(payload: any): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: "1h" });
  }

  static verifyToken(token: string, requiredRole?: string): any {
    try {
      const decodedToken: any = jwt.verify(token, this.secretKey);
      if (requiredRole && decodedToken.role !== requiredRole) {
        throw new Error("Insufficient permissions");
      }
      return decodedToken;
    } catch (error) {
      console.log(error, "<< error");
      return null;
    }
  }

  static authorizeUser(token: string) {
    const decodedToken = JwtHelper.verifyToken(token, UserRole.USER);
    if (!decodedToken) {
      throw new Error("Unauthorized: Invalid or missing token");
    }
    return decodedToken;
  }

  static authorizeCompany(token: string) {
    const decodedToken = JwtHelper.verifyToken(token, UserRole.COMPANY);
    if (!decodedToken) {
      throw new Error("Unauthorized: Invalid or missing token");
    }
    return decodedToken;
  }
}
