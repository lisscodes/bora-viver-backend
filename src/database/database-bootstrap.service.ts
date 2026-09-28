import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class DatabaseBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseBootstrapService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.runSqlFile(join(process.cwd(), 'sql', 'schema.sql'));

    const [{ total }] = await this.dataSource.query(
      'SELECT COUNT(*)::int AS total FROM atividade',
    );

    if (Number(total) === 0) {
      await this.runSqlFile(join(process.cwd(), 'sql', 'seed.sql'));
      this.logger.log('Banco inicializado com schema.sql + seed.sql');
    } else {
      this.logger.log(`Banco já possui ${total} atividades — seed ignorado`);
    }
  }

  private async runSqlFile(filePath: string) {
    const sql = readFileSync(filePath, 'utf8');
    const statements = sql
      .split(';')
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 0 && !this.isCommentOnly(chunk));

    for (const statement of statements) {
      await this.dataSource.query(statement);
    }
  }

  private isCommentOnly(statement: string): boolean {
    return statement.split('\n').every((line) => {
      const trimmed = line.trim();
      return trimmed.length === 0 || trimmed.startsWith('--');
    });
  }
}
