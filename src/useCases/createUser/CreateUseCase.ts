import { client } from "../../prisma/client";

import { hash } from "bcryptjs";

interface IUserRequest {
  name: string;
  password: string;
  username: string;
}

class CreateUserUseCase {
  async execute({ name, username, password }: IUserRequest) {
    // Verificar se o usuário existe
    const userAlreadyExist = await client.user.findFirst({
      where: {
        username,
      },
    });
    if (userAlreadyExist) {
      throw new Error("User already exists!");
    }

    // Cadastrar o usuário
    const passwordHash = await hash(password, 8);

    const user = await client.user.create({
      data: {
        name,
        username,
        password: passwordHash,
      },
    });
    return user;
  }
}

export { CreateUserUseCase };
