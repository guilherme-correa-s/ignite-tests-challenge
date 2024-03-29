import { InMemoryUsersRepository } from "../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../../src/modules/users/useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "../../src/modules/users/useCases/createUser/CreateUserUseCase";


describe("CreateUserUseCase", () => {
  let usersRepositoryInMemory: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = {
      name: "GCorrea",
      email: "guilhermescorrea@hotmail.com.br",
      password: "any-password",
    }

    const userCreated = await createUserUseCase.execute(user);

    expect(userCreated).toHaveProperty("id");

    expect(userCreated.name).toBe(user.name);
    expect(userCreated.email).toBe(user.email);
  });

  it("should not be able to create a new user with an email already registered", async () => {
    const user = {
      name: "GCorrea",
      email: "guilhermescorrea@hotmail.com.br",
      password: "any-password",
    }

    await createUserUseCase.execute(user);

    try {
      await createUserUseCase.execute(user);
    } catch (error: any) {
      expect(error).toBeInstanceOf(CreateUserError);
      expect(error.message).toBe('User already exists');
      expect(error.statusCode).toBe(400);
    }
  });
});
