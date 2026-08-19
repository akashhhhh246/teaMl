import { prisma } from '../database/prisma.js';

export class BaseRepository {
  constructor(modelName) {
    this.model = prisma[modelName];
  }

  async findById(id) {
    return this.model.findUnique({ where: { id } });
  }

  async findMany(params = {}) {
    return this.model.findMany(params);
  }

  async create(data) {
    return this.model.create({ data });
  }

  async update(id, data) {
    return this.model.update({ where: { id }, data });
  }

  async delete(id) {
    return this.model.delete({ where: { id } });
  }

  async count(where = {}) {
    return this.model.count({ where });
  }
}
