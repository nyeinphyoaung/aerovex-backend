export enum EmailJobName {
  WELCOME_EMAIL = 'welcome-email',
  RESET_PASSWORD_EMAIL = 'reset-password-email',
}

export interface WelcomeEmailJobPayload {
  to: string;
  name: string;
  verificationUrl: string;
}
