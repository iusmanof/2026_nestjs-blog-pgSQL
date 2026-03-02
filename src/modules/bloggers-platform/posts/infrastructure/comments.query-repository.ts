// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { CommentsQueryParamsDto } from '../api/dto/comments-query-params.dto';
// import { SortDirection } from '../../../../../../2026_nestjs-blog-pgSQL/src/core/dto/base.query-params.dto';
// import { Comment, CommentDocument } from '../domain/comment.entity';
//
// @Injectable()
// class CommentsQueryRepository {
//   constructor(
//     @InjectModel(Comment.name)
//     private readonly commentModel: Model<CommentDocument>,
//   ) {}
//
//   findById(commentId: string) {
//     return this.commentModel.findOne({ _id: commentId });
//   }
//
//   // REFACTOR ADD : Promise<CommentDocument>
//   async getByPostId(postId: string, query: CommentsQueryParamsDto) {
//     const filter = { postId };
//
//     const totalCount = await this.commentModel.countDocuments(filter);
//
//     const sortField = query.sortBy || 'createdAt';
//     const sortOrder = query.sortDirection === SortDirection.Asc ? 1 : -1;
//
//     const items = await this.commentModel
//       .find(filter)
//       .sort({ [sortField]: sortOrder })
//       .skip(query.calculateSkip())
//       .limit(query.pageSize)
//       .lean();
//
//     return {
//       pagesCount: Math.ceil(totalCount / query.pageSize),
//       page: query.pageNumber,
//       pageSize: query.pageSize,
//       totalCount,
//       items,
//     };
//   }
// }
//
// export default CommentsQueryRepository;
