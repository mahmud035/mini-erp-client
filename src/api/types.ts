/**
 * Response envelope returned by every Mini ERP API endpoint.
 * Mirrors the backend 1:1 so a contract change breaks TypeScript at
 * compile time, not runtime.
 */
export interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}
