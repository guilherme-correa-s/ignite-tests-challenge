import { Request, Response } from 'express'
import { container } from 'tsyringe';
import { TransferOperationUseCase } from './TransferStatementOperationUseCase';

export class TransferStatementOperationController {
  async execute(req: Request, res: Response): Promise<Response> {
    const {
      body: { amount, description },
      user: { id: sender_id },
      params: { user_id }
    } = req;

    const transferOperationUseCase = container.resolve(TransferOperationUseCase);

    const transfer = await transferOperationUseCase.execute({
      sender_id,
      user_id,
      amount,
      description
    })

    return res.json(transfer)
  }
}
