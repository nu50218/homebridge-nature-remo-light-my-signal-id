import { LightBulb } from '../src/lightbulb';
import { LoggingMock } from './mocks/logging.mock';
import axios from 'axios';

jest.mock('axios');

const random_uuids = [
  'a3d7e182-fabc-4cfa-88ab-63d4ef12a789',
  '60bc1237-8e0a-4f6b-97e9-01a23b45c678',
  'f57e8d01-23f4-4629-9abc-5e1f23d456e0',
  'd9a7bc34-5e78-4d3a-bfcd-2a56e78901b2',
  'c412ef8a-57b3-4982-9dab-3254ef6789ab',
];

const random_tokens = [
  'X3LtmBzrjQF72-G5j3oDx1bFLpW8zehV_ZY01567op9.R6Rd9xyz1eQrtRkfEDcHPu3ZEP-a_snoZBvlyE8uDEf',
  'F8YkiZwdpRV03-N0q5lGh4eQWnX5yijK_VP09254lm7.P4Pl3ghi5eVwtTlfGHjIKo5YTUV-i_klpXCdefG6hIJk',
  'R5DtlCxsyMW19-H4x2oAz2tJKoY6zahJ_ZX07869qr5.N7Nf2klm4eLrtRofFDaHRv4ZWP-q_rstZAvwxH9iLMO',
  'L2WuiAqrpGX24-V1y6mFt3cRLnM7xukL_WL04523dp6.Q5Qe1opq3eMvuVkgHIoIJn6XTO-l_mnoMDghjK7jKLN',
  'K9ZojOzlvHY15-B7w9rEy5fTSiZ3xebH_YH05678st4.O8Oa0uvw2eNwtXmfJKlLMp7YWUR-j_ijkWEzxF8zZAB',
];

test('get light off status', async () => {

  const light_off_state = [
    {
      'id': random_uuids[0],
      'light': {
        'state': {
          'brightness': '100',
          'last_button': 'on',
          'power': 'off',
        },
      },
    }];
  const resp = { data: light_off_state };
  (axios.get as jest.Mock).mockResolvedValue(resp);

  const lightbulb = new LightBulb(
    'https://api.nature.global',
    random_tokens[0],
    random_uuids[2],
    random_uuids[1],
    random_uuids[0],
    LoggingMock.init(),
  );

  expect(await lightbulb.status()).toBe(false);
});

test('get light on status', async () => {
  const light_on_state = [
    {
      'id': random_uuids[0],
      'light': {
        'state': {
          'brightness': '100',
          'last_button': 'off',
          'power': 'on',
        },
      },
    }];
  const resp = { data: light_on_state };
  (axios.get as jest.Mock).mockResolvedValue(resp);

  const lightbulb = new LightBulb(
    'https://api.nature.global',
    random_tokens[0],
    random_uuids[2],
    random_uuids[1],
    random_uuids[0],
    LoggingMock.init(),
  );

  expect(await lightbulb.status()).toBe(true);
});

test('Turn off lightbulb without cache', async () => {

  const lightbulb = new LightBulb(
    'https://api.nature.global',
    random_tokens[0],
    random_uuids[2],
    random_uuids[1],
    random_uuids[0],
    LoggingMock.init(),
  );

  await lightbulb.off();

  expect((axios.post as jest.Mock)).toHaveBeenNthCalledWith(1, '/1/appliances/' + random_uuids[0] + '/light', 'button=' + 'off', {
    baseURL: 'https://api.nature.global',
    headers: {
      Authorization: 'Bearer ' + random_tokens[0],
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json',
    },
  });

  expect(axios.post as jest.Mock).toHaveBeenNthCalledWith(2, '/1/signals/' + random_uuids[1] + '/send', null, {
    baseURL: 'https://api.nature.global',
    headers: {
      Authorization: 'Bearer ' + random_tokens[0],
    },
  });
});