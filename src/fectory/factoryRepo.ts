import { IUserRepository } from "../interfaces/userInterface";
import { IInviteeRepository } from "../interfaces/inviteesInterfaces";
import { IEventRepository } from "../interfaces/eventInterface";

import { connectPostgresDb } from "../config/postgresdb/db";
import mariadb from "../config/mariadb/db";

import { PostgresUserRepository } from "../repositories/postgres/userRepository";
import { PostgresInviteesRepository } from "../repositories/postgres/inviteesRepository";
import { PostgresEventRepository } from "../repositories/postgres/eventRepositary";

import { MariaDbUserRepository } from "../repositories/mariadb/userRepositary";
import { MariaDbInviteesRepository } from "../repositories/mariadb/inviteesRepo";
import { MariaDbEventRepository } from "../repositories/mariadb/eventRepositary";

export function createRepositories(dbType: string): {
  userRepository: IUserRepository;
  inviteesRepository: IInviteeRepository;
  eventRepository: IEventRepository;
} {
  switch (dbType) {
    case "postgres":
      const pgPool = connectPostgresDb();
      return {
        userRepository: new PostgresUserRepository(pgPool),
        inviteesRepository: new PostgresInviteesRepository(pgPool),
        eventRepository: new PostgresEventRepository(pgPool),
      };
    case "mariadb":
      return {
        userRepository: new MariaDbUserRepository(mariadb),
        inviteesRepository: new MariaDbInviteesRepository(mariadb),
        eventRepository: new MariaDbEventRepository(mariadb),
      };
    default:
      throw new Error("Unsupported DB_TYPE");
  }
}
