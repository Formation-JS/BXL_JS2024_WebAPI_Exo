import Member from '../models/member.model';

export type MemberCreateForm = Omit<Member, 'id'|'isDisable'|'lastConnection'|'role'|'stockEntries'>

export type MemberUpdateForm = Omit<MemberCreateForm, 'login'|'password'>

export type MemberLoginForm = {
  login: string;
  password: string;
}