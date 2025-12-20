import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  excerpt: string;
  imageUrl: string;
  content: string;
  category: string;
  seoTags: string[];
  author: mongoose.Types.ObjectId;
}

const BlogPostSchema: Schema<IBlogPost> = new Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  imageUrl: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  seoTags: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: 'User' }, // Assuming an admin user writes it
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

const BlogPost: Model<IBlogPost> = mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
export default BlogPost;