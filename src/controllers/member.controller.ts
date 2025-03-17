import type { Request, Response } from 'express';
import * as memberService from '../services/member.service';
import { MemberData } from '../@types/member';

const memberController = {

  add: async (req: Request, res: Response) => {
    const data = req.body as MemberData;

    if (await memberService.exists(data.login)) {
      res.status(409).json({ error: `Login "${data.login}" already exists` });
      return;
    }

    const memberCreated = await memberService.create(data);

    res.status(201)
      .location(`/api/member/${memberCreated.id}`)
      .json(memberCreated);
  },

  getInfo: (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  modify: (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  lock: (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  login: (req: Request, res: Response) => {
    res.sendStatus(501);
  }

};

export default memberController;