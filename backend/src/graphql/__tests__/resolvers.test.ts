import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { resolvers } from '../resolvers';
import * as dbModule from '../../db/index';

// Mock the database
jest.mock('../../db/index', () => ({
  db: {
    select: jest.fn() as any,
    insert: jest.fn() as any,
    update: jest.fn() as any,
    delete: jest.fn() as any,
  },
  weightRecords: {
    id: 'id',
    userId: 'userId',
    weight: 'weight',
    unit: 'unit',
    notes: 'notes',
    recordedAt: 'recordedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  users: {
    id: 'id',
    email: 'email',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
}));

describe('GraphQL Resolvers', () => {
  let mockDb: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = (dbModule as any).db;
  });

  describe('Query.weightRecords', () => {
    it('should return weight records with pagination', async () => {
      const mockRecords = [
        {
          id: 1,
          userId: 1,
          weight: '70.50',
          unit: 'kg',
          notes: 'Test note',
          recordedAt: new Date('2025-10-19T08:00:00.000Z'),
          createdAt: new Date('2025-10-19T08:05:00.000Z'),
          updatedAt: new Date('2025-10-19T08:05:00.000Z'),
        },
      ];

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue(mockRecords),
      };

      const mockCountSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([{ count: 1 }]),
      };

      mockDb.select.mockReturnValueOnce(mockSelect).mockReturnValueOnce(mockCountSelect);

      const result = await resolvers.Query.weightRecords(null, {
        userId: 1,
        limit: 10,
        offset: 0,
      });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('hasMore');
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.hasMore).toBe(false);
      expect(result.data[0].weight).toBe('70.50');
    });

    it('should handle empty results', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([]),
      };

      const mockCountSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([{ count: 0 }]),
      };

      mockDb.select.mockReturnValueOnce(mockSelect).mockReturnValueOnce(mockCountSelect);

      const result = await resolvers.Query.weightRecords(null, {
        limit: 10,
        offset: 0,
      });

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });
  });

  describe('Query.weightRecord', () => {
    it('should return a single weight record', async () => {
      const mockRecord = {
        id: 1,
        userId: 1,
        weight: '70.50',
        unit: 'kg',
        notes: 'Test note',
        recordedAt: new Date('2025-10-19T08:00:00.000Z'),
        createdAt: new Date('2025-10-19T08:05:00.000Z'),
        updatedAt: new Date('2025-10-19T08:05:00.000Z'),
      };

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([mockRecord]),
      };

      mockDb.select.mockReturnValue(mockSelect);

      const result = await resolvers.Query.weightRecord(null, { id: 1 });

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.weight).toBe('70.50');
    });

    it('should return null for non-existent record', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      mockDb.select.mockReturnValue(mockSelect);

      const result = await resolvers.Query.weightRecord(null, { id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('Query.weightRecordsByUser', () => {
    it('should return all records for a user', async () => {
      const mockRecords = [
        {
          id: 1,
          userId: 1,
          weight: '70.50',
          unit: 'kg',
          notes: null,
          recordedAt: new Date('2025-10-19T08:00:00.000Z'),
          createdAt: new Date('2025-10-19T08:05:00.000Z'),
          updatedAt: new Date('2025-10-19T08:05:00.000Z'),
        },
        {
          id: 2,
          userId: 1,
          weight: '71.00',
          unit: 'kg',
          notes: 'Gained weight',
          recordedAt: new Date('2025-10-20T08:00:00.000Z'),
          createdAt: new Date('2025-10-20T08:05:00.000Z'),
          updatedAt: new Date('2025-10-20T08:05:00.000Z'),
        },
      ];

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(mockRecords),
      };

      mockDb.select.mockReturnValue(mockSelect);

      const result = await resolvers.Query.weightRecordsByUser(null, { userId: 1 });

      expect(result).toHaveLength(2);
      expect(result[0].userId).toBe(1);
      expect(result[1].userId).toBe(1);
    });
  });

  describe('Mutation.createWeightRecord', () => {
    it('should create a new weight record', async () => {
      const mockRecord = {
        id: 1,
        userId: 1,
        weight: '70.50',
        unit: 'kg',
        notes: 'New record',
        recordedAt: new Date('2025-10-19T08:00:00.000Z'),
        createdAt: new Date('2025-10-19T08:05:00.000Z'),
        updatedAt: new Date('2025-10-19T08:05:00.000Z'),
      };

      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockRecord]),
      };

      mockDb.insert.mockReturnValue(mockInsert);

      const result = await resolvers.Mutation.createWeightRecord(null, {
        input: {
          userId: 1,
          weight: '70.50',
          unit: 'kg',
          notes: 'New record',
        },
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.weight).toBe('70.50');
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should throw error for invalid weight format', async () => {
      await expect(
        resolvers.Mutation.createWeightRecord(null, {
          input: {
            userId: 1,
            weight: 'invalid',
            unit: 'kg',
          },
        })
      ).rejects.toThrow('Weight must be a valid number with up to 2 decimal places');
    });

    it('should throw error for invalid unit', async () => {
      await expect(
        resolvers.Mutation.createWeightRecord(null, {
          input: {
            userId: 1,
            weight: '70.50',
            unit: 'invalid',
          },
        })
      ).rejects.toThrow('Unit must be either "kg" or "lbs"');
    });

    it('should use default unit "kg" if not provided', async () => {
      const mockRecord = {
        id: 1,
        userId: 1,
        weight: '70.50',
        unit: 'kg',
        notes: null,
        recordedAt: new Date('2025-10-19T08:00:00.000Z'),
        createdAt: new Date('2025-10-19T08:05:00.000Z'),
        updatedAt: new Date('2025-10-19T08:05:00.000Z'),
      };

      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockRecord]),
      };

      mockDb.insert.mockReturnValue(mockInsert);

      const result = await resolvers.Mutation.createWeightRecord(null, {
        input: {
          userId: 1,
          weight: '70.50',
        },
      });

      expect(result.unit).toBe('kg');
    });
  });

  describe('Mutation.updateWeightRecord', () => {
    it('should update a weight record', async () => {
      const existingRecord = {
        id: 1,
        userId: 1,
        weight: '70.50',
        unit: 'kg',
        notes: 'Old note',
        recordedAt: new Date('2025-10-19T08:00:00.000Z'),
        createdAt: new Date('2025-10-19T08:05:00.000Z'),
        updatedAt: new Date('2025-10-19T08:05:00.000Z'),
      };

      const updatedRecord = {
        ...existingRecord,
        weight: '71.00',
        notes: 'Updated note',
        updatedAt: new Date('2025-10-19T20:00:00.000Z'),
      };

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([existingRecord]),
      };

      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([updatedRecord]),
      };

      mockDb.select.mockReturnValue(mockSelect);
      mockDb.update.mockReturnValue(mockUpdate);

      const result = await resolvers.Mutation.updateWeightRecord(null, {
        id: 1,
        input: {
          weight: '71.00',
          notes: 'Updated note',
        },
      });

      expect(result).toBeDefined();
      expect(result.weight).toBe('71.00');
      expect(result.notes).toBe('Updated note');
    });

    it('should throw error for non-existent record', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      mockDb.select.mockReturnValue(mockSelect);

      await expect(
        resolvers.Mutation.updateWeightRecord(null, {
          id: 999,
          input: {
            weight: '71.00',
          },
        })
      ).rejects.toThrow('Weight record not found');
    });

    it('should validate weight format on update', async () => {
      const existingRecord = {
        id: 1,
        userId: 1,
        weight: '70.50',
        unit: 'kg',
        notes: 'Test',
        recordedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([existingRecord]),
      };

      mockDb.select.mockReturnValue(mockSelect);

      await expect(
        resolvers.Mutation.updateWeightRecord(null, {
          id: 1,
          input: {
            weight: 'invalid',
          },
        })
      ).rejects.toThrow('Weight must be a valid number with up to 2 decimal places');
    });
  });

  describe('Mutation.deleteWeightRecord', () => {
    it('should delete a weight record', async () => {
      const existingRecord = {
        id: 1,
        userId: 1,
        weight: '70.50',
        unit: 'kg',
        notes: null,
        recordedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([existingRecord]),
      };

      const mockDelete = {
        where: jest.fn().mockResolvedValue(undefined),
      };

      mockDb.select.mockReturnValue(mockSelect);
      mockDb.delete.mockReturnValue(mockDelete);

      const result = await resolvers.Mutation.deleteWeightRecord(null, { id: 1 });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Weight record deleted successfully');
      expect(mockDb.delete).toHaveBeenCalled();
    });

    it('should throw error for non-existent record', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      mockDb.select.mockReturnValue(mockSelect);

      await expect(
        resolvers.Mutation.deleteWeightRecord(null, { id: 999 })
      ).rejects.toThrow('Weight record not found');
    });
  });
});
