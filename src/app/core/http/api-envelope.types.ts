export interface ApiSuccessResponse<T> {
  readonly success: true;
  readonly data: T;
}
