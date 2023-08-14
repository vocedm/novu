import { ZenviaProvider } from './zenvia.provider';

test('should trigger zenvia library correctly with sms domain', async () => {
  const provider = new ZenviaProvider({
    apiKey: 'SG.',
    domain: 'SMS',
    from: '123',
  });

  const spy = jest
    .spyOn(provider, 'sendMessage')
    .mockImplementation(async () => {
      return {
        date: new Date().toISOString(),
        id: Math.ceil(Math.random() * 100),
      } as any;
    });

  await provider.sendMessage({
    content: 'Your otp code is 32901',
    from: 'ZenviaSms Test',
    to: '+2347063317344',
  });

  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith({
    to: '+2347063317344',
    from: 'ZenviaSms Test',
    content: 'Your otp code is 32901',
  });
});

test('should trigger zenvia library correctly with whatsapp domain', async () => {
  const provider = new ZenviaProvider({
    apiKey: 'SG.',
    domain: 'WHATSAPP',
    from: '123',
  });

  const spy = jest
    .spyOn(provider, 'sendMessage')
    .mockImplementation(async () => {
      return {
        date: new Date().toISOString(),
        id: Math.ceil(Math.random() * 100),
      } as any;
    });

  await provider.sendMessage({
    content: 'Your otp code is 32901',
    from: 'WhatsApp Test',
    to: '+2347063317344',
  });

  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith({
    to: '+2347063317344',
    from: 'WhatsApp Test',
    content: 'Your otp code is 32901',
  });
});
