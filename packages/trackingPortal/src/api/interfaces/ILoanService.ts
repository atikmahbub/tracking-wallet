import { IAddLoanParams, IUpdateLoanParams } from "@shared/params";
import { LoanId, UserId } from "@shared/primitives";
import { LoanModel } from "@shared/models/LoanModel";

export interface ILoanService {
  addLoan(params: IAddLoanParams): Promise<LoanModel>;
  getLoanByUserId(userId: UserId): Promise<LoanModel[]>;
  updateLoan(params: IUpdateLoanParams): Promise<LoanModel>;
  deleteLoan(id: LoanId): Promise<void>;
}
