import type { User, NewUser } from "@wareflow/db";

export type { User, NewUser };

export type SafeUser = Omit<User, "password">;
