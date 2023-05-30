const seckretKeys: any = {
  admin_seckret_key: "admin_seckret_key",
  user_seckret_key: "user_seckret_key",
};

const scope = {
  admin: "admin",
  user: "user",
};

const defaultLimit = 9;
const saltRounds = 10;

export { seckretKeys, scope, defaultLimit, saltRounds };
