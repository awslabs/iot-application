import { SetMetadata } from '@nestjs/common';

export const isPublicMetadataKey = 'isPublic';

/**
 * Decorator to mark controller classes or handlers as publicly accessible without authorization.
 * @returns
 */
export const Public = () => SetMetadata(isPublicMetadataKey, true);
