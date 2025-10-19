export const typeDefs = `
  type WeightRecord {
    id: Int!
    userId: Int!
    weight: String!
    unit: String!
    notes: String
    recordedAt: String!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: Int!
    email: String!
    name: String!
    createdAt: String!
    updatedAt: String!
    weightRecords: [WeightRecord!]!
  }

  input CreateWeightRecordInput {
    userId: Int!
    weight: String!
    unit: String
    notes: String
    recordedAt: String
  }

  input UpdateWeightRecordInput {
    weight: String
    unit: String
    notes: String
    recordedAt: String
  }

  type WeightRecordsConnection {
    data: [WeightRecord!]!
    total: Int!
    hasMore: Boolean!
  }

  type Query {
    # Get all weight records with pagination and filtering
    weightRecords(
      userId: Int
      limit: Int = 50
      offset: Int = 0
    ): WeightRecordsConnection!

    # Get a single weight record by ID
    weightRecord(id: Int!): WeightRecord

    # Get all weight records for a specific user
    weightRecordsByUser(userId: Int!): [WeightRecord!]!

    # Get user by ID
    user(id: Int!): User
  }

  type Mutation {
    # Create a new weight record
    createWeightRecord(input: CreateWeightRecordInput!): WeightRecord!

    # Update a weight record
    updateWeightRecord(id: Int!, input: UpdateWeightRecordInput!): WeightRecord!

    # Delete a weight record
    deleteWeightRecord(id: Int!): DeleteResult!
  }

  type DeleteResult {
    success: Boolean!
    message: String!
  }
`;
