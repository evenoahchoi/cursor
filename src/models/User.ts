import { Schema, model, models } from 'mongoose';

export interface IUser {
  email: string;
  nickname?: string;
  birthYear?: number;
  gender?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  nickname: { type: String },
  birthYear: { type: Number },
  gender: { type: String },
});

const User = models.User || model<IUser>('User', UserSchema);
export default User;
