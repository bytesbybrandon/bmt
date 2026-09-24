import { allBlogPosts as allPosts } from '@/contentlayer-generated'

export function getBlogPosts() {
  return allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(slug) {
  return allPosts.find((post) => post.slug === slug && !post.draft)
}

export function getAllTags() {
  const tags = new Set()
  allPosts
    .filter((post) => !post.draft)
    .forEach((post) => post.tags?.forEach((tag) => tags.add(tag)))
  return Array.from(tags).sort()
}

export function getPostsByTag(tag) {
  return getBlogPosts().filter((post) => post.tags?.includes(tag))
}

export function formatDate(date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function readingTime(content) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}