export function ArrayException(data: string[]) {
  if (!Array.isArray(data)) {
    data = [data];
  }

  return data;
}
