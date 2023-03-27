import { useState } from 'react';

export function useDeleteModalVisibility() {
  return useState(false);
}
