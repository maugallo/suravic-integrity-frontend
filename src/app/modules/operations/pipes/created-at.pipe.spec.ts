import { CreatedAtPipe } from './created-at.pipe';

describe('CreatedAtPipe', () => {
  it('create an instance', () => {
    const pipe = new CreatedAtPipe();
    expect(pipe).toBeTruthy();
  });
});
