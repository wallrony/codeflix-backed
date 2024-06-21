import { ValueObject } from '../value-object';

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(
    readonly prop1: string,
    readonly prop2: string,
  ) {
    super();
  }
}

describe('ValueObject Unit Tests', () => {
  describe('equals', () => {
    test('should return false when comparing with undefined', () => {
      const valueObject = new StringValueObject('test');
      expect(valueObject.equals(undefined)).toBeFalsy();

      const complexValueObject = new ComplexValueObject('test', 'test2');
      expect(complexValueObject.equals(undefined)).toBeFalsy();
    });

    test('should return false when comparing with null', () => {
      const valueObject = new StringValueObject('test');
      expect(valueObject.equals(null)).toBeFalsy();

      const complexValueObject = new ComplexValueObject('test', 'test2');
      expect(complexValueObject.equals(null)).toBeFalsy();
    });

    test('should return false when comparing with different value', () => {
      const valueObject = new StringValueObject('test');
      const valueObject2 = new StringValueObject('test2');
      expect(valueObject.equals(valueObject2)).toBeFalsy();

      const complexValueObject = new ComplexValueObject('test', 'test2');
      const complexValueObject2 = new ComplexValueObject('test2', 'test');
      expect(complexValueObject.equals(complexValueObject2)).toBeFalsy();
    });

    test('should return true when comparing with same value', () => {
      const valueObject = new StringValueObject('test');
      const valueObject2 = new StringValueObject('test');
      expect(valueObject.equals(valueObject2)).toBeTruthy();

      const complexValueObject = new ComplexValueObject('test', 'test2');
      const complexValueObject2 = new ComplexValueObject('test', 'test2');
      expect(complexValueObject.equals(complexValueObject2)).toBeTruthy();
    });
  });
});
