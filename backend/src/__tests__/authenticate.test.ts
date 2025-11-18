import { Request, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/authenticate';

describe('Authentication Middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;

    req = {
      headers: {},
    };

    res = {
      status: statusMock,
      json: jsonMock,
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should attach user_id to request when valid UUID provided', () => {
    req.headers = {
      'x-user-id': '123e4567-e89b-12d3-a456-426614174000',
    };

    authenticate(req as AuthenticatedRequest, res as Response, next);

    expect(req.user_id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(next).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should return 401 when no user_id header provided', () => {
    req.headers = {};

    authenticate(req as AuthenticatedRequest, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when invalid UUID format provided', () => {
    req.headers = {
      'x-user-id': 'invalid-uuid',
    };

    authenticate(req as AuthenticatedRequest, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid user ID format',
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when empty user_id provided', () => {
    req.headers = {
      'x-user-id': '',
    };

    authenticate(req as AuthenticatedRequest, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle uppercase UUID', () => {
    req.headers = {
      'x-user-id': '123E4567-E89B-12D3-A456-426614174000',
    };

    authenticate(req as AuthenticatedRequest, res as Response, next);

    expect(req.user_id).toBe('123E4567-E89B-12D3-A456-426614174000');
    expect(next).toHaveBeenCalled();
  });
});
