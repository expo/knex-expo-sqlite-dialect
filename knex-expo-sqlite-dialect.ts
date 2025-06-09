import type { Database } from 'expo-sqlite';
import ClientSQLite3 from 'knex/lib/dialects/sqlite3';

class ClientExpoSQLite extends ClientSQLite3 {
  _driver() {
    return require('expo-sqlite');
  }

  async acquireRawConnection(): Promise<any> {
    const openDatabaseAsync = this.driver
      .openDatabaseAsync as typeof import('expo-sqlite').openDatabaseAsync;
    return openDatabaseAsync(this.connectionSettings.filename, {
      useNewConnection: true,
    });
  }

  async destroyRawConnection(connection: Database): Promise<void> {
    await connection.closeAsync();
  }

  async _query(connection: Database, obj: any): Promise<any> {
    if (!obj.sql) throw new Error('The query is empty');

    if (!connection) {
      throw new Error('No connection provided');
    }

    const { method } = obj;
    let expectReturning = true;
    switch (method) {
      case 'insert':
      case 'update':
        expectReturning = obj.returning;
        break;
      case 'counter':
      case 'del':
        expectReturning = false;
        break;
      default:
        expectReturning = true;
    }

    if (expectReturning) {
      const response = await connection.allAsync(obj.sql, obj.bindings);
      obj.response = response;
      return obj;
    } else {
      const response = await connection.runAsync(obj.sql, obj.bindings);
      obj.response = response;
      obj.context = {
        lastID: response.lastInsertRowid,
        changes: response.changes,
      };
      return obj;
    }
  }
}

Object.assign(ClientExpoSQLite.prototype, {
  driverName: 'expo-sqlite',
});

export default ClientExpoSQLite as any;
