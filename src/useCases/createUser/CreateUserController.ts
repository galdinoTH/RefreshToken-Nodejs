import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUseCase";

class CreateUserController {
  async handle(request: Request, response: Response) {
    const { username, name, password } = request.body;

    const createUserUseCase = new CreateUserUseCase();

    const user = await createUserUseCase.execute({
      username,
      name,
      password,
    });

    response.json(user);
  }
}

export { CreateUserController };
