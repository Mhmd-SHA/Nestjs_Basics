import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
@Schema()
export class ResetToken extends Document {
  @Prop({ required: true })
  userId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  token: string;
  @Prop({ required: true })
  expiryDate: Date;
}
export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);
