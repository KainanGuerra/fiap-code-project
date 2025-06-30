import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, customName: string): string {
    return customName || snakeCase(className);
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return (
      snakeCase(embeddedPrefixes.join('_')) +
      (customName || snakeCase(propertyName))
    );
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
  ): string {
    return snakeCase(
      `${firstTableName}_${firstPropertyName.replace(
        /\./gi,
        '_',
      )}_${secondTableName}`,
    );
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(`${tableName}_${columnName || propertyName}`);
  }

  classTableInheritanceParentColumnName(
    parentTableName: string,
    parentTableIdPropertyName: string,
  ): string {
    return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`);
  }

  indexName(
    tableOrName: string | Table,
    columnNames: string[],
    where?: string,
  ): string {
    const tableName = this.getTableName(tableOrName);
    return snakeCase(
      SnakeNamingStrategy.ShortenName(
        `idx_${tableName}_${columnNames.join('_')}`,
      ),
    );
  }

  uniqueConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
  ): string {
    const tableName = this.getTableName(tableOrName);
    return snakeCase(
      SnakeNamingStrategy.ShortenName(
        `uq_${tableName}_${columnNames.join('_')}`,
      ),
    );
  }

  private static ShortenName(name: string, maxLength: number = 63): string {
    const abbreviateWord = (word: string): string =>
      word.length > maxLength ? word.slice(0, 3) : word;

    const words = name.split('_');
    const abbreviatedWords = words.map((word, index, array) =>
      index > 0 && array[index] === array[index - 1]
        ? word.slice(0, 3)
        : abbreviateWord(word),
    );

    const response = abbreviatedWords.join('_');
    return response.length > 63
      ? SnakeNamingStrategy.ShortenName(response, maxLength - 1)
      : response;
  }
}
