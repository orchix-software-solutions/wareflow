import { logger } from "@/core";

export interface EmailService {
  sendMail(params: { to: string; subject: string; body: string }): Promise<void>;
}

/** No-op email service used until a real email provider is wired up. */
export const noopEmailService: EmailService = {
  async sendMail(params) {
    logger.info(
      { to: params.to, subject: params.subject },
      "Email send skipped — no email provider configured",
    );
  },
};
