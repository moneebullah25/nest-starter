import { AuthUser } from '../../src/auth/auth-user';

export const mockUser = (fields?: Partial<AuthUser>): AuthUser => ({
  firstName: 'Muneeb',
  middleName: null,
  lastName: 'Ullah',
  username: 'moneebullah25',
  image: null,
  birthDate: new Date('2001-08-27'),
  registrationDate: new Date(),
  email: 'moneebullah25@gmail.com',
  id: 1,
  emailVerified: true,
  passwordHash: 'passwordHash',
  ...fields,
});
