import { db, weightRecords, users } from '../db/index.js';
import { eq, desc, and, sql } from 'drizzle-orm';

export const resolvers = {
  Query: {
    // Get all weight records with pagination and filtering
    weightRecords: async (_parent: any, args: any) => {
      const { userId, limit = 50, offset = 0 } = args;

      try {
        const conditions = userId ? [eq(weightRecords.userId, userId)] : [];

        // Get records
        const records = await db
          .select()
          .from(weightRecords)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(weightRecords.recordedAt))
          .limit(limit)
          .offset(offset);

        // Get total count
        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(weightRecords)
          .where(conditions.length > 0 ? and(...conditions) : undefined);

        const total = Number(countResult[0]?.count || 0);
        const hasMore = offset + limit < total;

        return {
          data: records.map(record => ({
            ...record,
            recordedAt: record.recordedAt.toISOString(),
            createdAt: record.createdAt.toISOString(),
            updatedAt: record.updatedAt.toISOString(),
          })),
          total,
          hasMore,
        };
      } catch (error) {
        throw new Error(`Failed to fetch weight records: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    // Get a single weight record by ID
    weightRecord: async (_parent: any, args: any) => {
      const { id } = args;

      try {
        const record = await db
          .select()
          .from(weightRecords)
          .where(eq(weightRecords.id, id))
          .limit(1);

        if (record.length === 0) {
          return null;
        }

        return {
          ...record[0],
          recordedAt: record[0].recordedAt.toISOString(),
          createdAt: record[0].createdAt.toISOString(),
          updatedAt: record[0].updatedAt.toISOString(),
        };
      } catch (error) {
        throw new Error(`Failed to fetch weight record: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    // Get all weight records for a specific user
    weightRecordsByUser: async (_parent: any, args: any) => {
      const { userId } = args;

      try {
        const records = await db
          .select()
          .from(weightRecords)
          .where(eq(weightRecords.userId, userId))
          .orderBy(desc(weightRecords.recordedAt));

        return records.map(record => ({
          ...record,
          recordedAt: record.recordedAt.toISOString(),
          createdAt: record.createdAt.toISOString(),
          updatedAt: record.updatedAt.toISOString(),
        }));
      } catch (error) {
        throw new Error(`Failed to fetch user weight records: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    // Get user by ID
    user: async (_parent: any, args: any) => {
      const { id } = args;

      try {
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.id, id))
          .limit(1);

        if (userResult.length === 0) {
          return null;
        }

        return {
          ...userResult[0],
          createdAt: userResult[0].createdAt.toISOString(),
          updatedAt: userResult[0].updatedAt.toISOString(),
        };
      } catch (error) {
        throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  },

  Mutation: {
    // Create a new weight record
    createWeightRecord: async (_parent: any, args: any) => {
      const { input } = args;

      // Validate weight format
      const weightRegex = /^\d+(\.\d{1,2})?$/;
      if (!weightRegex.test(input.weight)) {
        throw new Error('Weight must be a valid number with up to 2 decimal places');
      }

      // Validate unit
      if (input.unit && !['kg', 'lbs'].includes(input.unit)) {
        throw new Error('Unit must be either "kg" or "lbs"');
      }

      try {
        const newRecord = await db
          .insert(weightRecords)
          .values({
            userId: input.userId,
            weight: input.weight,
            unit: input.unit || 'kg',
            notes: input.notes || null,
            recordedAt: input.recordedAt ? new Date(input.recordedAt) : new Date(),
          })
          .returning();

        return {
          ...newRecord[0],
          recordedAt: newRecord[0].recordedAt.toISOString(),
          createdAt: newRecord[0].createdAt.toISOString(),
          updatedAt: newRecord[0].updatedAt.toISOString(),
        };
      } catch (error) {
        throw new Error(`Failed to create weight record: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    // Update a weight record
    updateWeightRecord: async (_parent: any, args: any) => {
      const { id, input } = args;

      // Validate weight format if provided
      if (input.weight) {
        const weightRegex = /^\d+(\.\d{1,2})?$/;
        if (!weightRegex.test(input.weight)) {
          throw new Error('Weight must be a valid number with up to 2 decimal places');
        }
      }

      // Validate unit if provided
      if (input.unit && !['kg', 'lbs'].includes(input.unit)) {
        throw new Error('Unit must be either "kg" or "lbs"');
      }

      try {
        // Check if record exists
        const existing = await db
          .select()
          .from(weightRecords)
          .where(eq(weightRecords.id, id))
          .limit(1);

        if (existing.length === 0) {
          throw new Error('Weight record not found');
        }

        // Build update data
        const updateData: any = {
          updatedAt: new Date(),
        };

        if (input.weight !== undefined) updateData.weight = input.weight;
        if (input.unit !== undefined) updateData.unit = input.unit;
        if (input.notes !== undefined) updateData.notes = input.notes;
        if (input.recordedAt !== undefined) updateData.recordedAt = new Date(input.recordedAt);

        // Update the record
        const updated = await db
          .update(weightRecords)
          .set(updateData)
          .where(eq(weightRecords.id, id))
          .returning();

        return {
          ...updated[0],
          recordedAt: updated[0].recordedAt.toISOString(),
          createdAt: updated[0].createdAt.toISOString(),
          updatedAt: updated[0].updatedAt.toISOString(),
        };
      } catch (error) {
        throw new Error(`Failed to update weight record: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    // Delete a weight record
    deleteWeightRecord: async (_parent: any, args: any) => {
      const { id } = args;

      try {
        // Check if record exists
        const existing = await db
          .select()
          .from(weightRecords)
          .where(eq(weightRecords.id, id))
          .limit(1);

        if (existing.length === 0) {
          throw new Error('Weight record not found');
        }

        // Delete the record
        await db
          .delete(weightRecords)
          .where(eq(weightRecords.id, id));

        return {
          success: true,
          message: 'Weight record deleted successfully',
        };
      } catch (error) {
        throw new Error(`Failed to delete weight record: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  },

  // Field resolvers
  User: {
    weightRecords: async (parent: any) => {
      try {
        const records = await db
          .select()
          .from(weightRecords)
          .where(eq(weightRecords.userId, parent.id))
          .orderBy(desc(weightRecords.recordedAt));

        return records.map(record => ({
          ...record,
          recordedAt: record.recordedAt.toISOString(),
          createdAt: record.createdAt.toISOString(),
          updatedAt: record.updatedAt.toISOString(),
        }));
      } catch (error) {
        throw new Error(`Failed to fetch user weight records: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  },
};
