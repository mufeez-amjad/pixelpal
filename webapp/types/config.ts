import { Knex } from "knex";

export interface AppConfig {
	port: number;
	db: Knex.Config
}
