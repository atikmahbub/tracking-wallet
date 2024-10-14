import { InvestModel } from "@shared/models";
import {
  IAddInvestParams,
  IGetInvestParams,
  IUpdateInvestParams,
} from "@shared/params";
import { InvestId } from "@shared/primitives";

export interface IInvestService {
  addInvest(params: IAddInvestParams): Promise<InvestModel>;
  updateInvest: (params: IUpdateInvestParams) => Promise<InvestModel>;
  getInvestByUserId: (params: IGetInvestParams) => Promise<InvestModel[]>;
  deleteInvest(id: InvestId): Promise<void>;
}
