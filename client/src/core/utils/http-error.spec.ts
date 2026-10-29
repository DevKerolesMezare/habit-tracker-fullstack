import { HttpErrorResponse } from '@angular/common/http';
import { getHttpErrorDetails } from './http-error';

describe('getHttpErrorDetails', () => {
  it('preserves non-empty string responses', () => {
    const error = new HttpErrorResponse({ error: ' Request failed. ' });

    expect(getHttpErrorDetails(error)).toEqual({ message: ' Request failed. ' });
  });

  it('extracts problem details and validation messages', () => {
    const error = new HttpErrorResponse({
      error: {
        detail: 'Request details.',
        title: 'Request failed.',
        errors: {
          name: ['Name is required.'],
          count: ['Must be positive.', 42],
        },
      },
    });

    expect(getHttpErrorDetails(error)).toEqual({
      detail: 'Request details.',
      title: 'Request failed.',
      validationErrors: 'Name is required. Must be positive.',
    });
  });

  it('returns no details for an empty or unsupported response', () => {
    expect(getHttpErrorDetails(new HttpErrorResponse({ error: '   ' }))).toEqual({});
    expect(getHttpErrorDetails(new HttpErrorResponse({ error: null }))).toEqual({});
  });
});
