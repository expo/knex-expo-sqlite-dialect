import type { Client } from 'knex';

declare class ClientExpoSQLite extends Client {
  acquireRawConnection(): Promise<any>;
  destroyRawConnection(connection: any): Promise<void>;
  driverName: string;
}

export default ClientExpoSQLite;
