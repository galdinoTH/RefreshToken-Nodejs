import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      message: "Token is missing",
    });
  }

  const [, token] = authToken.split(" ");

  try {
    verify(token, "5cc96047-3f9b-464d-ac6e-777100298720");

    return next();
  } catch (err) {
    return response.status(401).json({
      message: "Token invalid",
    });
  }
}
