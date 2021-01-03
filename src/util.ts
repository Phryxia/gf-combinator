export class Util {
  public static defaultValue(str: string, dvalue: string): string {
    return str ? str : dvalue;
  }

  public static isIn(value: any, array: any[]): boolean {
    return array.indexOf(value) !== -1;
  }
}