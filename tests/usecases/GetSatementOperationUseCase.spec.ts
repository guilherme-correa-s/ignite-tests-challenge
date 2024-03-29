import { InMemoryStatementsRepository } from "../../src/modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../src/modules/statements/useCases/createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../../src/modules/statements/useCases/createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "../../src/modules/statements/useCases/getStatementOperation/GetStatementOperationError";
import { GetStatementOperationUseCase } from "../../src/modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../src/modules/users/useCases/createUser/CreateUserUseCase";


describe("GetStatementUseCase", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUserCase: CreateStatementUseCase;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUserCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  });

  it("Should be able to get a statement", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "GCorrea",
      email: "guilhermescorrea@hotmail.com.br",
      password: "any-password",
    });

    const statement = {
      user_id: userCreated.id!,
      type: "deposit",
      amount: 100,
      description: "descriprtion"
    } as ICreateStatementDTO

    const statementCreated = await createStatementUserCase.execute(statement)

    const statementFound = await getStatementOperationUseCase.execute({
      user_id: userCreated.id!,
      statement_id: statementCreated.id!
    })

    expect(statementFound).toHaveProperty("id");
    expect(statementFound.user_id).toEqual(statementCreated.user_id)
  })

  it("should return user not found when user is not found", async () => {
    try {
      await getStatementOperationUseCase.execute({
        user_id: "user_id",
        statement_id: "statement_id"
      })
    } catch (error: any) {
      expect(error).toBeInstanceOf(GetStatementOperationError.UserNotFound);
      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
    }
  });

  it("should return user not found when statement is not found", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "GCorrea",
      email: "guilhermescorrea@hotmail.com.br",
      password: "any-password",
    });

    try {
      await getStatementOperationUseCase.execute({
        user_id: userCreated.id!,
        statement_id: "statement_id"
      })
    } catch (error: any) {
      expect(error).toBeInstanceOf(GetStatementOperationError.StatementNotFound);
      expect(error.message).toBe('Statement not found');
      expect(error.statusCode).toBe(404);
    }
  });
});
