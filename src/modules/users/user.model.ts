import { Schema, model, InferSchemaType, Types } from 'mongoose';

export const ROLES = ['student', 'tutor', 'admin'] as const;
export type Role = (typeof ROLES)[number];

const availabilitySchema = new Schema(
  {
    // 0 = domingo ... 6 = sábado
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    // Formato HH:mm (24 h)
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { _id: false },
);

const tutorProfileSchema = new Schema(
  {
    bio: { type: String, maxlength: 500, default: '' },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    availability: { type: [availabilitySchema], default: [] },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'student' },
    career: { type: String, trim: true },
    tutorProfile: { type: tutorProfileSchema, default: undefined },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };
export const User = model('User', userSchema);

/** Representación pública (sin contraseña ni campos internos). */
export function toPublicUser(u: any) {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    career: u.career,
    ...(u.tutorProfile ? { tutorProfile: u.tutorProfile } : {}),
  };
}
