import { InMemoryStatementsRepository } from "../../src/modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../../src/modules/statements/useCases/createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../../src/modules/statements/useCases/createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../../src/modules/statements/useCases/createStatement/ICreateStatementDTO";
import { InMemoryUsersRepository } from "../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../src/modules/users/useCases/createUser/CreateUserUseCase";




describe("CreateStatementUseCase", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able to create a statement", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "GCorrea",
      email: "guilhermescorrea@hotmail.com.br",
      password: "any-password",
    });

    const statement = {
      user_id: userCreated.id,
      type: "deposit",
      amount: 100,
      description: "description"
    } as ICreateStatementDTO

    const statementCreated = await createStatementUseCase.execute(statement)

    expect(statementCreated).toHaveProperty("id")

    expect(statementCreated.user_id).toBe(userCreated.id);
    expect(statementCreated.type).toBe(statement.type);
    expect(statementCreated.amount).toBe(statement.amount);
    expect(statementCreated.description).toBe(statement.description);
  })

  it("should return user not found when id is invalid", async () => {
    const statement = {
      user_id: 'invalid id',
      type: "deposit",
      amount: 100,
      description: "description"
    } as ICreateStatementDTO

    try {
      await createStatementUseCase.execute(statement);
    } catch (error: any) {
      expect(error).toBeInstanceOf(CreateStatementError.UserNotFound);
      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
    }
  });

  it("should return user not found when have insufficient funds", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "GCorrea",
      email: "guilhermescorrea@hotmail.com.br",
      password: "any-password",
    });

    const statement = {
      user_id: userCreated.id,
      type: "withdraw",
      amount: 1000000,
      description: "description"
    } as ICreateStatementDTO

    try {
      await createStatementUseCase.execute(statement);
    } catch (error: any) {
      expect(error).toBeInstanceOf(CreateStatementError.InsufficientFunds);
      expect(error.message).toBe('Insufficient funds');
      expect(error.statusCode).toBe(400);
    }
  });
})
