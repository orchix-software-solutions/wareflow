export const rateLimitConfig = {
  global: {
    max: 100,
    timeWindow: "1 minute",
  },
  login: {
    max: 5,
    timeWindow: "1 minute",
  },
  session: {
    max: 30,
    timeWindow: "1 minute",
  },
  write: {
    max: 30,
    timeWindow: "1 minute",
  },
  otp: {
    max: 5,
    timeWindow: "1 minute",
  },
} as const;
