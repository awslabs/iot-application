import { extractedMetaTags } from './meta-tags';

describe('extractedMetaTags', () => {
  it('returns extracted meta tag values', () => {
    const mockMetaTag1 = document.createElement('meta');
    const mockMetaTag2 = document.createElement('meta');

    const mockMetaTag1Name = 'authenticationFlowType';
    const mockMetaTag1Content = 'authenticationFlowTypeContent';
    const mockMetaTag2Name = 'cognitoEndpoint';
    const mockMetaTag2Content = 'cognitoEndpointContent';

    mockMetaTag1.name = mockMetaTag1Name;
    mockMetaTag1.content = mockMetaTag1Content;
    mockMetaTag2.name = mockMetaTag2Name;
    mockMetaTag2.content = mockMetaTag2Content;

    const metaTags = extractedMetaTags([mockMetaTag1, mockMetaTag2]);

    expect(metaTags).toMatchObject({
      [mockMetaTag1Name]: mockMetaTag1Content,
      [mockMetaTag2Name]: mockMetaTag2Content,
    });
  });

  it('does not contain meta tag values not specified', () => {
    const mockMetaTag = document.createElement('meta');

    const mockMetaTagName = 'doesNotExist';
    const mockMetaTagContent = 'doesNotExistContent';

    mockMetaTag.name = mockMetaTagName;
    mockMetaTag.content = mockMetaTagContent;

    const metaTags = extractedMetaTags([mockMetaTag]);

    expect(metaTags).not.toMatchObject({
      [mockMetaTagName]: mockMetaTagContent,
    });
  });
});
