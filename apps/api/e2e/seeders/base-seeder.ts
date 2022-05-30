import { seed } from '@ngneat/falso';
import { SEED_ID } from './seed-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/app/modules/prisma/prisma.service';

seed(SEED_ID);

@Injectable()
export abstract class Seeder<T extends { id: number } = { id: number }> {
  protected readonly data: Map<number, T> = new Map();

  public constructor(protected readonly prisma: PrismaService) {}

  public getById(id: number): T | null {
    return this.data.get(id) ?? null;
  }

  public getManyById(ids: number[]): T[] {
    return ids.map((id) => this.getById(id)).filter(Boolean) as T[];
  }

  public getAll(): T[] {
    return Array.from(this.data.values());
  }

  public store(data: T | T[]): void {
    if (Array.isArray(data)) {
      data.forEach((item) => this.data.set(item.id, item));
    } else {
      this.data.set(data.id, data);
    }
  }

  public clearData(): void {
    this.data.clear();
  }

  public abstract seed(): Promise<T[]>;

  public abstract clean(): Promise<void>;
}
