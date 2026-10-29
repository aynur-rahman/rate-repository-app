import { fireEventAsync as fireEvent, render, screen, within } from '@testing-library/react-native';
import * as Linking from 'expo-linking';
import { RepositoryListContainer } from '../src/components/RepositoryList';
import RepositoryItem from '../src/components/RepositoryItem';
import ReviewItem from '../src/components/ReviewItem';
import repositories from './fixtures/repositories';

jest.mock('expo-router', () => ({ router: { push: jest.fn(), replace: jest.fn() } }));
jest.mock('expo-linking', () => ({ openURL: jest.fn() }));

describe('RepositoryListContainer', () => {
  it('renders all seven required fields for both official fixture repositories', async () => {
    await render(<RepositoryListContainer repositories={repositories} />);
    const cards = screen.getAllByTestId('repositoryItem');
    expect(cards).toHaveLength(2);
    const expected = [
      ['jaredpalmer/formik', 'Build forms in React, without the tears', 'TypeScript', '1.6k', '21.9k', '88', '3'],
      ['async-library/react-async', 'Flexible promise-based React data loader', 'JavaScript', '69', '1.8k', '72', '3'],
    ];
    expected.forEach((fields, index) => {
      fields.forEach(value => expect(within(cards[index]).getByText(value, { exact: true })).toBeOnTheScreen());
    });
  });

  it('selects the pressed repository by its id', async () => {
    const onSelect = jest.fn();
    await render(<RepositoryListContainer repositories={repositories} onSelect={onSelect} />);
    await fireEvent.press(screen.getByRole('button', { name: 'View async-library/react-async' }));
    expect(onSelect).toHaveBeenCalledWith('async-library.react-async');
  });

  it('shows the empty state when the query has no matches', async () => {
    await render(<RepositoryListContainer repositories={{ edges: [], pageInfo: { hasNextPage: false, endCursor: null } }} />);
    expect(screen.getByText('No repositories found.')).toBeOnTheScreen();
    expect(screen.queryByTestId('repositoryItem')).toBeNull();
  });
});

describe('RepositoryItem', () => {
  it('opens the exact repository URL only when the detail action is pressed', async () => {
    const repository = { ...repositories.edges[0].node, url: 'https://github.com/jaredpalmer/formik' };
    await render(<RepositoryItem repository={repository} showLink />);
    expect(Linking.openURL).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Open in GitHub' }));
    expect(Linking.openURL).toHaveBeenCalledWith(repository.url);
  });

  it('renders a user-friendly review date and the reviewer identity', async () => {
    await render(<ReviewItem review={{ id: 'review-1', repositoryId: 'repo-1', rating: 93, text: 'Useful documentation', createdAt: '2026-03-24T12:00:00.000Z', user: { id: 'user-1', username: 'reader' } }} />);
    expect(screen.getByText('24 Mar 2026')).toBeOnTheScreen();
    expect(screen.getByText('reader')).toBeOnTheScreen();
    expect(screen.getByText('93')).toBeOnTheScreen();
    expect(screen.getByText('Useful documentation')).toBeOnTheScreen();
  });
});
