/** Error de dominio con código HTTP asociado. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }

  static badRequest(msg: string, details?: unknown) { return new ApiError(400, msg, details); }
  static unauthorized(msg = 'No autenticado') { return new ApiError(401, msg); }
  static forbidden(msg = 'No tienes permiso para esta operación') { return new ApiError(403, msg); }
  static notFound(msg = 'Recurso no encontrado') { return new ApiError(404, msg); }
  static conflict(msg: string) { return new ApiError(409, msg); }
}
