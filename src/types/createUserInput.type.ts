export type TCreateUserInput = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNo: number;
    twoFactorAuth: {
      activated: boolean;
      secret: string | null;
      recoveryCodes: {
        code: string;
        used: boolean;
      }[];
    };
  };
  