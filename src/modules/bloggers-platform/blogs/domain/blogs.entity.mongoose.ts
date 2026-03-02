// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument, Model } from 'mongoose';
// import { CreateBlogDto } from '../api/dto/create-blog.dto';
// import { UpdateBlogDto } from '../api/dto/update-blog.dto';
//
// @Schema({ timestamps: { createdAt: true, updatedAt: false } })
// export class Blog {
//   @Prop({ type: String, required: true, maxlength: 15 })
//   name: string;
//
//   @Prop({ type: String, required: true, maxlength: 500 })
//   description: string;
//
//   @Prop({ type: String, required: true })
//   websiteUrl: string;
//
//   @Prop({ type: Boolean, default: false })
//   isMembership: boolean;
//
//   createdAt: Date;
//
//   static createInstance(dto: CreateBlogDto): BlogDocument {
//     const instance = new this() as BlogDocument;
//     instance.name = dto.name;
//     instance.description = dto.description;
//     instance.websiteUrl = dto.websiteUrl;
//     return instance;
//   }
//
//   update(dto: UpdateBlogDto) {
//     this.name = dto.name;
//     this.description = dto.description;
//     this.websiteUrl = dto.websiteUrl;
//   }
// }
//
// // создаёт mongoose-схему на основе класса
// export const BlogSchema = SchemaFactory.createForClass(Blog);
//
// // регистрирует методы (если они есть) в схеме mongoose
// BlogSchema.loadClass(Blog);
//
// // Типизация документа (экземпляр из БД)
// export type BlogDocument = HydratedDocument<Blog>;
//
// // Типизация модели (Model + статические методы класса)
// export type BlogModelType = Model<BlogDocument> & typeof Blog;
