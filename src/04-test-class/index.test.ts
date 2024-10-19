import {
  getBankAccount,
  TransferFailedError,
  InsufficientFundsError,
  SynchronizationFailedError,
} from './index';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(20);
    expect(bankAccount.getBalance()).toBe(20);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(20);
    expect(() => bankAccount.withdraw(40)).toThrow(InsufficientFundsError);
    expect(() => bankAccount.withdraw(40)).toThrow(
      'Insufficient funds: cannot withdraw more than 20',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const bankAccount1 = getBankAccount(40);
    const bankAccount2 = getBankAccount(20);

    expect(() => bankAccount1.transfer(60, bankAccount2)).toThrow(
      InsufficientFundsError,
    );
    expect(() => bankAccount1.transfer(60, bankAccount2)).toThrow(
      'Insufficient funds: cannot withdraw more than 40',
    );
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(40);
    expect(() => bankAccount.transfer(20, bankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(40);
    bankAccount.deposit(20);
    expect(bankAccount.getBalance()).toBe(60);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(40);
    bankAccount.withdraw(20);
    expect(bankAccount.getBalance()).toBe(20);
  });

  test('should transfer money', () => {
    const bankAccount1 = getBankAccount(40);
    const bankAccount2 = getBankAccount(20);
    bankAccount1.transfer(20, bankAccount2);
    expect(bankAccount1.getBalance()).toBe(20);
    expect(bankAccount2.getBalance()).toBe(40);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const bankAccount = getBankAccount(40);
    (random as jest.Mock).mockReturnValueOnce(1);

    const balance = await bankAccount.fetchBalance();
    expect(balance).not.toBeNull();
    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(40);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(30);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(30);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(40);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(null);
    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
