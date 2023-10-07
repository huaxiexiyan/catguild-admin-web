// 密码模式请求参数
export interface LoginParam {
  grant_type: string;
  username: string;
  password: string;
  tenantId: string;
}

// 密码模式登录返回参数
export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}
