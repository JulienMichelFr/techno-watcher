import { PostSourcePipe } from './post-source.pipe';

describe('PostSourcePipe', () => {
  const pipe: PostSourcePipe = new PostSourcePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return correct value when used on a valid url', () => {
    const url: string = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    expect(pipe.transform(url)).toBe('www.youtube.com');
  });

  it('should return provided value when used on an invalid url', () => {
    const invalidUrl: string = 'test';
    expect(pipe.transform(invalidUrl)).toBe('test');
  });
});
