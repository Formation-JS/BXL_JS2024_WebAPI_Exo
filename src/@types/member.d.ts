import Member from '../models/member.model';

export type MemberCreateData = Omit<Member, 'id'|'isDisable'|'lastConnection'|'role'>

export type MemberUpdateData = Omit<MemberCreateData, 'login'|'password'>
