import type { AuthToken, LoginParam } from '@/api/auth/model/loginModel';
import { ContentTypeEnum } from '@/constants';
import { request } from '@/utils/request';

const Api = {
  PasswordLogin: '/auth/oauth2/token',
};

export function passwordLogin(data: LoginParam) {
  return request.post<AuthToken>(
    {
      url: Api.PasswordLogin,
      data,
      headers: {
        Authorization: 'Basic bWVzc2FnaW5nLWNsaWVudDpzZWNyZXQ=',
        'Content-Type': ContentTypeEnum.FormURLEncoded,
      },
    },
    { retry: { count: 0, delay: 0 }, isTransformResponse: false },
  );
}
