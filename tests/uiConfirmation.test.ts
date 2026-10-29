import { Alert } from 'react-native';
import confirmDelete from '../src/utils/confirmDelete';

afterEach(() => jest.restoreAllMocks());

it('requires the destructive native alert action before deleting a review', () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const onConfirm = jest.fn();
  confirmDelete(onConfirm);
  expect(onConfirm).not.toHaveBeenCalled();
  expect(alert).toHaveBeenCalledWith('Delete review', expect.any(String), expect.any(Array), { cancelable: true });
  const buttons = alert.mock.calls[0][2]!;
  expect(buttons.find(button => button.text === 'Cancel')).toMatchObject({ style: 'cancel' });
  buttons.find(button => button.text === 'Cancel')?.onPress?.();
  expect(onConfirm).not.toHaveBeenCalled();
  const destructive = buttons.find(button => button.text === 'Delete')!;
  expect(destructive.style).toBe('destructive');
  destructive.onPress?.();
  expect(onConfirm).toHaveBeenCalledTimes(1);
});
