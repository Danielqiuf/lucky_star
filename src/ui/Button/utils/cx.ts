export function cx(...list: Array<string | undefined | false | null>) {
  return list.filter(Boolean).join(' ')
}
