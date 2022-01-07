import axios from 'axios';
import { GelatoProductCatalog, GelatoProductCatalogApi } from './catalog';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;
mockAxios.create.mockReturnThis();

describe('GelatoProductCatalogApi', () => {
  const api = new GelatoProductCatalogApi({ apiKey: 'dummy-token' });

  it('should be created', () => {
    expect(api).toBeTruthy();
  });

  describe('.list()', () => {
    it('should fetch mock data from correct url path', async () => {
      const data: GelatoProductCatalog[] = [];
      mockAxios.get.mockImplementationOnce(() => Promise.resolve(data));
      const r = await api.list();
      expect(r).toEqual(data);
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});
