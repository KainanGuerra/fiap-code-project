import { join, map } from 'lodash';
import { hash } from 'typeorm/util/StringUtils';

export function generatePgName(prefix: string, enumData: object) {
  const hashName = hash(join(map(enumData), '_'), {
    length: 63 - (prefix.length + 1),
  });
  return `${prefix}_${hashName}`;
}
