import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import * as path from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

jest.mock('fs/promises');
jest.mock('fs');

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('should set timeout with provided callback and timeout', () => {
    const cb = jest.fn();
    doStuffByTimeout(cb, 1000);

    expect(setTimeout).toHaveBeenCalledWith(cb, 1000);
  });

  test('should call callback only after timeout', () => {
    const cb = jest.fn();
    doStuffByTimeout(cb, 1000);

    jest.advanceTimersByTime(1000);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  describe('doStuffByInterval', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.spyOn(global, 'setInterval');
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.restoreAllMocks();
    });

    test('should set interval with provided callback and interval', () => {
      const cb = jest.fn();
      doStuffByInterval(cb, 1000);

      expect(setInterval).toHaveBeenCalledWith(cb, 1000);
    });

    test('should call callback multiple times after multiple intervals', () => {
      const cb = jest.fn();
      doStuffByInterval(cb, 1000);

      jest.advanceTimersByTime(3000);
      expect(cb).toHaveBeenCalledTimes(3);
    });
  });

  describe('readFileAsynchronously', () => {
    const mockPath = 'text.txt';
    const mockContent = 'Hello, Peter';

    beforeEach(() => {
      jest.clearAllMocks();
      (readFile as jest.Mock).mockResolvedValue(Buffer.from(mockContent));
      (existsSync as jest.Mock).mockReturnValue(true);
      (path.join as jest.Mock).mockReturnValue(mockPath);
    });

    test('should call join with pathToFile', async () => {
      await readFileAsynchronously(mockPath);
      expect(path.join).toHaveBeenCalledWith(__dirname, mockPath);
    });

    test('should return null if file does not exist', async () => {
      (existsSync as jest.Mock).mockReturnValue(false);
      const result = await readFileAsynchronously(mockPath);
      expect(result).toBeNull();
    });

    test('should return file content if file exists', async () => {
      const result = await readFileAsynchronously(mockPath);
      expect(result).toBe(mockContent);
    });
  });
});
