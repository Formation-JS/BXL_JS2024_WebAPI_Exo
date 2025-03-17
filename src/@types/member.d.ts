import Member from '../models/member.model';

export type MemberData = Omit<Member, 'id'|'isDisable'|'lastConnection'|'role'>
