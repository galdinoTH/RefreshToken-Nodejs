import { compare } from "bcryptjs";
import { client } from "../../prisma/client";
import { sign } from "jsonwebtoken";
import { GenerateRefreshToken } from "../../provider/GenerateRefreshToken";
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider";

interface IRequest {
  username: string;
  password: string;
}

class AuthenticateUserUseCase {
  async execute({ username, password }: IRequest) {
    // Verificar se usuário existe
    const userAlreadyExist = await client.user.findFirst({
      where: {
        username,
      },
    });

    if (!userAlreadyExist) {
      throw new Error("User or password incorrect");
    }

    // Verificar se a senha está correta
    const passwordMatch = await compare(password, userAlreadyExist.password);

    if (!passwordMatch) {
      throw new Error("User or password incorret");
    }

    // Gerar token do usuário
    const generateTokenProvider = new GenerateTokenProvider();
    const token = await generateTokenProvider.execute(userAlreadyExist.id);

    await client.refreshToken.deleteMany({
      where: {
        userId: userAlreadyExist.id,
      },
    });

    const generateRefreshToken = new GenerateRefreshToken();
    const refreshToken = await generateRefreshToken.execute(
      userAlreadyExist.id
    );

    return { token, refreshToken };
  }
}

export { AuthenticateUserUseCase };
