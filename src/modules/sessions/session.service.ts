import { Types } from 'mongoose';
import { ApiError } from '../../shared/utils/ApiError';
import { Subject } from '../subjects/subject.model';
import { Role, User } from '../users/user.model';
import { Session, SessionStatus } from './session.model';
import { CreateSessionInput } from './session.schemas';
import { canTransition, fitsAvailability } from './session.rules';

const ACTIVE: SessionStatus[] = ['pending', 'confirmed'];

const populateSession = [
  { path: 'student', select: 'name email' },
  { path: 'tutor', select: 'name email' },
  { path: 'subject', select: 'code name' },
];

export async function create(studentId: string, input: CreateSessionInput) {
  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(startsAt.getTime() + input.durationMin * 60_000);
  if (startsAt.getTime() <= Date.now()) throw ApiError.badRequest('La sesión debe programarse en el futuro');

  const [tutor, subject] = await Promise.all([
    User.findOne({ _id: input.tutorId, role: 'tutor' }),
    Subject.findById(input.subjectId),
  ]);
  if (!tutor) throw ApiError.notFound('Asesor no encontrado');
  if (!subject) throw ApiError.notFound('Materia no encontrada');
  if (String(tutor._id) === studentId) throw ApiError.badRequest('No puedes reservar una asesoría contigo mismo');

  const profile = tutor.tutorProfile;
  const teaches = profile?.subjects?.some((s: Types.ObjectId) => String(s) === input.subjectId);
  if (!teaches) throw ApiError.badRequest('El asesor no imparte esa materia');
  if (!fitsAvailability(startsAt, endsAt, (profile?.availability ?? []) as any)) {
    throw ApiError.badRequest('El horario está fuera de la disponibilidad del asesor');
  }

  // Traslape: otra sesión activa del asesor o del estudiante que cruce el intervalo.
  const clash = await Session.exists({
    status: { $in: ACTIVE },
    $or: [{ tutor: tutor._id }, { student: studentId }],
    startsAt: { $lt: endsAt },
    endsAt: { $gt: startsAt },
  });
  if (clash) throw ApiError.conflict('El horario se traslapa con otra asesoría activa');

  const session = await Session.create({
    student: studentId, tutor: tutor._id, subject: subject._id, startsAt, endsAt, topic: input.topic,
  });
  return session.populate(populateSession);
}

export async function listMine(userId: string, role: Role, status?: string) {
  const filter: Record<string, unknown> = role === 'tutor' ? { tutor: userId } : { student: userId };
  if (status) filter.status = status;
  return Session.find(filter).sort({ startsAt: 1 }).populate(populateSession);
}

export async function updateStatus(sessionId: string, userId: string, role: Role, status: SessionStatus) {
  const session = await Session.findById(sessionId);
  if (!session) throw ApiError.notFound('Asesoría no encontrada');

  const isParticipant = String(session.student) === userId || String(session.tutor) === userId;
  if (!isParticipant) throw ApiError.forbidden('Sólo los participantes pueden modificar esta asesoría');

  if (!canTransition(session.status as SessionStatus, status, role)) {
    throw ApiError.conflict(`No se puede cambiar de "${session.status}" a "${status}" con rol ${role}`);
  }
  session.status = status;
  await session.save();
  return session.populate(populateSession);
}
