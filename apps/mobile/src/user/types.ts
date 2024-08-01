import {UpdateUserValidator, UserInterface} from '../lib/api/client.schemas';

export type User = Required<UserInterface>;

export type UpdateUserData = UpdateUserValidator;
