import React from 'react';

type SortIndicatorProps = {
  sort: false | 'asc' | 'desc';
};

export function SortIndicator({ sort }: SortIndicatorProps) {
  if (sort === 'asc') return <span> ▲</span>;
  if (sort === 'desc') return <span> ▼</span>;
  return null;
}
