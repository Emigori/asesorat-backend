import { Schema, model } from 'mongoose';

export const SESSION_STATUS = ['pending', 'confirmed', 'cancelled', 'completed'] as const;
export type SessionStatus = (typeof SESSION_STATUS)[number];

const sessionSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tutor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    topic: { type: String, trim: true, maxlength: 200 },
    status: { type: String, enum: SESSION_STATUS, default: 'pending' },
  },
  { timestamps: true },
);

sessionSchema.index({ tutor: 1, startsAt: 1 });
sessionSchema.index({ student: 1, startsAt: 1 });

export const Session = model('Session', sessionSchema);
