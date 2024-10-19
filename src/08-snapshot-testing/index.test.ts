import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const input = [6, 5, 4];
    const expectedOutput = {
      value: 6,
      next: {
        value: 5,
        next: {
          value: 4,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    const result = generateLinkedList(input);
    expect(result).toStrictEqual(expectedOutput);
  });

  test('should generate linked list from values 2', () => {
    const input = [4, 5, 6];
    const result = generateLinkedList(input);
    expect(result).toMatchSnapshot();
  });
});
