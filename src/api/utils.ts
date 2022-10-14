export const getIdFromEndpoint = (url: string): string => {
  return url?.split('/').filter(Boolean).pop() ?? ''
}
