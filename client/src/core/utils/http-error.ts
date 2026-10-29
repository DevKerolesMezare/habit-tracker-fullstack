import { HttpErrorResponse } from '@angular/common/http';

export interface HttpErrorDetails {
  message?: string;
  detail?: string;
  title?: string;
  validationErrors?: string;
}

export function getHttpErrorDetails(error: HttpErrorResponse): HttpErrorDetails {
  const body: unknown = error.error;

  if (typeof body === 'string' && body.trim()) {
    return { message: body };
  }

  if (typeof body !== 'object' || body === null) {
    return {};
  }

  const problem = body as Record<string, unknown>;
  const details: HttpErrorDetails = {};

  if (typeof problem['detail'] === 'string') {
    details.detail = problem['detail'];
  }

  if (typeof problem['title'] === 'string') {
    details.title = problem['title'];
  }

  const errors = problem['errors'];
  if (typeof errors === 'object' && errors !== null) {
    const messages = Object.values(errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value): value is string => typeof value === 'string');

    if (messages.length > 0) {
      details.validationErrors = messages.join(' ');
    }
  }

  return details;
}
