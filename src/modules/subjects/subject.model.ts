import { Schema, model } from 'mongoose';

const subjectSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

export const Subject = model('Subject', subjectSchema);
