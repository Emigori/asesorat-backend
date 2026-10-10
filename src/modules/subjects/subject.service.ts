import { ApiError } from '../../shared/utils/ApiError';
import { Subject } from './subject.model';
import { CreateSubjectInput } from './subject.schemas';

export async function create(input: CreateSubjectInput) {
  const exists = await Subject.exists({ code: input.code.toUpperCase() });
  if (exists) throw ApiError.conflict(`Ya existe una materia con clave ${input.code.toUpperCase()}`);
  return Subject.create(input);
}

export async function list(search?: string) {
  const filter = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { code: { $regex: search, $options: 'i' } }] }
    : {};
  return Subject.find(filter).sort({ name: 1 });
}

export async function getById(id: string) {
  const subject = await Subject.findById(id);
  if (!subject) throw ApiError.notFound('Materia no encontrada');
  return subject;
}
