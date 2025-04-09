import type { Request, Response } from 'express';
import * as memberService from '../services/member.service';
import { MemberCreateForm, MemberLoginForm, MemberUpdateForm } from '../@types/member';
import { generateToken } from '../utils/jwt.utils';
import { MemberRole } from '../models/member.model';
import { MemberDataDTO } from '../dto/member.dto';

const memberController = {

  add: async (req: Request, res: Response) => {
    const data = req.data as MemberCreateForm;

    if (await memberService.exists(data.login)) {
      res.status(409).json({ error: `Login "${data.login}" already exists` });
      return;
    }

    const memberCreated = await memberService.create(data);

    res.status(201)
      .location(`/api/member/${memberCreated.id}`)
      .json(new MemberDataDTO(memberCreated));
  },

  getInfo: async (req: Request, res: Response) => {
    const memberId = parseInt(req.params.id);

    if (isNaN(memberId)) {
      res.status(400).json({ error: 'Bad id parameter' });
      return;
    }

    const member = await memberService.getInfo(memberId);

    if (!member) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }

    res.status(200).json(new MemberDataDTO(member));
  },

  modify: async (req: Request, res: Response) => {
    const memberId = parseInt(req.params.id);
    const data = req.data as MemberUpdateForm;

    if (isNaN(memberId)) {
      res.status(400).json({ error: 'Bad id parameter' });
      return;
    }

    if (req.token!.id !== memberId && req.token!.role !== MemberRole.ADMIN) {
      res.sendStatus(403);
      return;
    }

    const isUpdated = await memberService.update(memberId, data);
    res.sendStatus(isUpdated ? 204 : 404);
  },

  lock: async (req: Request, res: Response) => {
    const memberId = parseInt(req.params.id);

    if (isNaN(memberId)) {
      res.status(400).json({ error: 'Bad id parameter' });
      return;
    }

    const isLocked = await memberService.lockAccount(memberId);
    res.sendStatus(isLocked ? 204 : 404);
  },

  login: async (req: Request, res: Response) => {
    const { login, password } = req.data as MemberLoginForm;

    const member = await memberService.login(login, password);
    if (!member) {
      res.status(400).json({ error: 'Credential is not valid !' });
      return;
    }

    const token = await generateToken(member);
    res.status(200).json({ token });
  }

};

export default memberController;