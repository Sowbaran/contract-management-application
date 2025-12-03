import { Logger, NotFoundException } from "@nestjs/common";
import { FilterQuery, Model, Types } from "mongoose";
import { AbstractSchema } from "./abstract.schema";

export abstract class AbstractRepository<TDocument extends AbstractSchema> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, "_id">): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return await createdDocument.save();
  }

  async createWorkFlow(document: Omit<TDocument, "_id">): Promise<TDocument> {
    const updatedDocument: any = { ...document, _id: new Types.ObjectId() };
    if (updatedDocument.workflowOrder) {
      // Convert role strings to ObjectIds
      updatedDocument.workflowOrder = updatedDocument.workflowOrder.map(
        (order: any) => ({
          ...order,
          role: new Types.ObjectId(order.role),
        }),
      );
    }
    const createdDocument = new this.model(updatedDocument);
    return await createdDocument.save();
  }

  async findOne(
    query: FilterQuery<TDocument>,
    projection?: any,
    options?: any,
  ): Promise<TDocument> {
    let queryBuilder: any = this.model.findOne(query, projection);
    if (options) {
      if (options.populate) {
        queryBuilder = queryBuilder.populate(options.populate);
      }
    }
    const document = await queryBuilder.lean();
    if (!document) {
      this.logger.warn(
        `Document not found with the filter query: ${JSON.stringify(query)}`,
      );
      throw new NotFoundException(
        `Document not found with the filter query: ${JSON.stringify(query)}`,
      );
    }
    return document;
  }

  async count(query: FilterQuery<TDocument>): Promise<number> {
    return this.model.countDocuments(query).exec();
  }

  async findOneExisting(
    query: FilterQuery<TDocument>,
    projection?: string | object,
    options?: {
      populate?: Array<{ path: string; model: string; select: string }>;
    },
  ): Promise<TDocument | null> {
    const queryExec = this.model
      .findOne(query, projection)
      .lean<TDocument>(true);

    if (options?.populate) {
      queryExec.populate(options.populate);
    }

    return queryExec;
  }

  async find(
    query: FilterQuery<TDocument>,
    options?: any,
  ): Promise<TDocument[]> {
    let queryBuilder: any = this.model.find(query);
    if (options) {
      if (options.populate) {
        queryBuilder = queryBuilder.populate(options.populate);
      }
      if (options.select) {
        queryBuilder = queryBuilder.select(options.select);
      }
      if (options.sort) {
        queryBuilder = queryBuilder.sort(options.sort);
      }
      if (options.skip) {
        queryBuilder = queryBuilder.skip(options.skip);
      }
      if (options.limit) {
        queryBuilder = queryBuilder.limit(options.limit);
      }
    }
    return await queryBuilder.lean();
  }

  async findById(
    id: string | Types.ObjectId,
    options?: any,
  ): Promise<TDocument | null> {
    let query: any = this.model.findById(id);
    if (options) {
      if (options.populate) {
        query = query.populate(options.populate);
      }
      if (options.select) {
        query = query.select(options.select);
      }
    }
    const document = await query.lean();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async findOneAndUpdate(
    query: FilterQuery<TDocument>,
    update: FilterQuery<TDocument>,
    options?: any,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(query, update, { ...options, new: true })
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn(
        `Document not found with the filter query: ${JSON.stringify(query)}`,
      );
      throw new NotFoundException(`Document not found`);
    }
    return document;
  }

  /*async find(query: FilterQuery<TDocument>): Promise<TDocument[]> {
    return await this.model.find(query).lean<TDocument[]>(true);
  }*/

  async findAll(): Promise<TDocument[]> {
    return await this.model.find().lean<TDocument[]>(true);
  }

  async findOneAndDelete(query: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOneAndDelete(query)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn(
        `Document not found with the filter query: ${JSON.stringify(query)}`,
      );
      throw new NotFoundException(`Document not found`);
    }
    return document;
  }
  
  async aggregate(
    pipeline: any[],
    options?: any,
  ): Promise<TDocument[]> {
    const documents = await this.model.aggregate(pipeline, options).exec();
    if (!documents || documents.length === 0) {
      this.logger.warn(`No documents found for pipeline: ${JSON.stringify(pipeline)}`);
      throw new NotFoundException(`No documents found`);
    }
    return documents;
  }
}
