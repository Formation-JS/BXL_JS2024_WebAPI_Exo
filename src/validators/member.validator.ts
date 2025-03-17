import z from 'zod';
import { MemberCreateData, MemberLoginData, MemberUpdateData } from '../@types/member';

export const memberUpdateValidator: z.ZodType<MemberUpdateData> = z.object({
  email: z.string({
    required_error: 'Le champs "email" est requis',
    invalid_type_error: 'L\'email doit être une chaîne de caractere'
  }).email('Le format de l\'email est invalide')
    .max(200, 'L\'email peut contenir maximum 200 caracteres')
    .trim(),
  firstname: z.string({
    required_error: 'Le champs "firstname" est requis',
    invalid_type_error: 'Le prénom doit être une chaîne de caractere'
  }).min(2, 'Le prénom doit contenir minimum 2 caracteres')
    .max(50, 'Le prénom peut contenir maximum 50 caracteres')
    .trim()
    .nullable(),
  lastname: z.string({
    required_error: 'Le champs "lastname" est requis',
    invalid_type_error: 'Le nom doit être une chaîne de caractere'
  }).min(2, 'Le nom doit contenir minimum 2 caracteres')
    .max(50, 'Le nom peut contenir maximum 50 caracteres')
    .trim()
    .nullable()
});

export const memberCreateValidator: z.ZodType<MemberCreateData> = memberUpdateValidator.and(z.object({
  login: z.string({
    required_error: 'Le champs "login" est requis',
    invalid_type_error: 'Le login doit être une chaîne de caractere'
  }).min(4, 'Le login doit contenir minimum 4 caracteres')
    .max(50, 'Le login peut contenir maximum 50 caracteres')
    .trim(),
  password: z.string({
    required_error: 'Le champs "password" est requis',
    invalid_type_error: 'Le mot de passe doit être une chaîne de caractere'
  })
}));

export const memberLoginValidator: z.ZodType<MemberLoginData> = z.object({
  login: z.string({
    required_error: 'Le champs "login" est requis',
    invalid_type_error: 'Le login doit être une chaîne de caractere'
  }),
  password: z.string({
    required_error: 'Le champs "password" est requis',
    invalid_type_error: 'Le mot de passe doit être une chaîne de caractere'
  })
});