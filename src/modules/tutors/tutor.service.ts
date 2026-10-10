import { ApiError } from '../../shared/utils/ApiError';
import { Subject } from '../subjects/subject.model';
import { User, toPublicUser } from '../users/user.model';
import { UpdateTutorProfileInput } from './tutor.schemas';

export async function updateMyProfile(userId: string, input: UpdateTutorProfileInput) {
  const uniqueIds = [...new Set(input.subjects)];
  const found = await Subject.countDocuments({ _id: { $in: uniqueIds } });
  if (found !== uniqueIds.length) throw ApiError.badRequest('Una o más materias no existen');

  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('Usuario no encontrado');
  user.set('tutorProfile', { bio: input.bio ?? '', subjects: uniqueIds, availability: input.availability });
  await user.save();
  await user.populate('tutorProfile.subjects', 'code name');
  return toPublicUser(user);
}

export async function list(subjectId?: string) {
  const filter: Record<string, unknown> = { role: 'tutor' };
  if (subjectId) filter['tutorProfile.subjects'] = subjectId;
  const tutors = await User.find(filter).populate('tutorProfile.subjects', 'code name').sort({ name: 1 });
  return tutors.map(toPublicUser);
}
