declare module '*.mdx' {
  import type { ComponentType } from 'react';
  export const lesson: import('@/lib/content').Lesson;
  const MDXContent: ComponentType;
  export default MDXContent;
}
