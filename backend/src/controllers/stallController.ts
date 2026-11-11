import type { Request, Response } from 'express';
import { StallService } from '../services/stallService.ts';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type {
  CreateStallInput,
  IdParam,
  StallQuery,
  UpdateStallInput,
} from '../schemas/stallSchema.ts';

export class StallController {
  private stallService: StallService;

  constructor(stallService: StallService = new StallService()) {
    this.stallService = stallService;
  }

  getStalls = async (_req: Request, res: Response): Promise<void> => {
    const query = getValidated<StallQuery>(res, 'query');
    const { data, total } = await this.stallService.getAllStalls(query);
    res.status(200).json({
      status: 'success',
      meta: { page: query.page, limit: query.limit, total },
      data,
    });
  };

  getStallById = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const data = await this.stallService.getStallById(id);
    res.status(200).json({ status: 'success', data });
  };

  getStallMenus = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const data = await this.stallService.getStallMenus(id);
    res.status(200).json({ status: 'success', data });
  };

  createStall = async (req: Request, res: Response): Promise<void> => {
    const body = getValidated<CreateStallInput>(res, 'body');
    const { id: ownerId } = getUser(req); // pemilik = user dari token
    const data = await this.stallService.createStall(body, ownerId);
    res.status(201).json({ status: 'success', data });
  };

  updateStall = async (req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const body = getValidated<UpdateStallInput>(res, 'body');
    const data = await this.stallService.updateStall(id, body, getUser(req));
    res.status(200).json({ status: 'success', data });
  };

  deleteStall = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const data = await this.stallService.deleteStall(id);
    res.status(200).json({ status: 'success', data });
  };
}