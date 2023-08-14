import { ZenviaProvider } from './zenvia.provider';
import { ZenviaParams } from '../types/param';
import axios from 'axios';

const mockConfig = {
  apiKey: 'test',
  domain: 'SMS',
  from: '123456789',
};

const mockNovuMessage = {
  to: '987654321',
  content: {
    contents: [
      {
        type: 'text',
        text: 'message text',
      },
    ],
  },
};

test('should trigger zenvia sms library correctly', async () => {
  const fakePost = jest.fn(() => {
    return Promise.resolve('0');
  });

  jest.spyOn(axios, 'post').mockImplementation(fakePost);

  const provider = new ZenviaProvider(mockConfig);

  await provider.sendMessage(mockNovuMessage);

  const data: ZenviaParams = {
    from: mockConfig.from,
    to: mockNovuMessage.to,
    contents: mockNovuMessage.content,
  };

  expect(fakePost).toBeCalled();
  expect(fakePost).toBeCalledWith(data);
});
