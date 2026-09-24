import { defineDocumentType, makeSource } from 'contentlayer/source-files'

const BlogPost = defineDocumentType(() => ({
  name: 'BlogPost',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    summary: { type: 'string', required: true },
    draft: { type: 'boolean', default: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.replace(/^blog\//, ''),
    },
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.flattenedPath.replace(/^blog\//, '')}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [BlogPost],
  disableImportAliasWarning: true,
})