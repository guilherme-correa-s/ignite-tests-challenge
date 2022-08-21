import { InMemoryUsersRepository } from "../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../src/modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../../src/modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../../src/modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../../src/modules/users/useCases/showUserProfile/ShowUserProfileUseCase";


describe("AuthenticateUserUseCase", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;
  let createUserUseCase: CreateUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should return incorrect email or password when email is not found", async () => {
    try {
      await authenticateUserUseCase.execute({
        email: 'any_email',
        password: 'any-password'
      });
    } catch(error: any) {
      expect(error).toBeInstanceOf(IncorrectEmailOrPasswordError);
      expect(error.message).toBe('Incorrect email or password');
      expect(error.statusCode).toBe(401);
    }
  });

  it("should return incorrect email or password when password not match", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "GCorrea",
      email: "guilhermescorrea@hotmail.com.br",
      password: "incorrect-password",
    });

    try {
      await authenticateUserUseCase.execute({
        email: userCreated.email,
        password: 'any-password'
      })
    } catch(error: any) {
      expect(error).toBeInstanceOf(IncorrectEmailOrPasswordError);
      expect(error.message).toBe('Incorrect email or password');
      expect(error.statusCode).toBe(401);
    }
  });
});
