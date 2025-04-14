import Member, { MemberRole } from '../models/member.model';

export class MemberDataDTO {
  id: number;
  login: string;
  email: string;
  role: MemberRole;
  firstname: string | null;
  lastname: string | null;
  lastConnection: string | null;

  constructor(member: Member) {
    this.id = member.id;
    this.login = member.login;
    this.email = member.email;
    this.role = member.role;
    this.firstname = member.firstname;
    this.lastname = member.lastname;
    this.lastConnection = member.lastConnection?.toISOString() ?? null
  }
}

export class MemberInfoDTO {
  id: number;
  login: string;
  role: MemberRole;

  constructor(member: Member) {
    this.id = member.id;
    this.login = member.login;
    this.role = member.role;
  }
}