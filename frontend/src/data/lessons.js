// Lightweight mock curriculum for each course
// Each lesson has id, title, type: 'video' | 'reading', duration, and content/url

export function getLessonsForCourse(courseId) {
  const base = String(courseId)
  const lessons = [
    { id: `${base}-1`, title: 'Welcome and Course Overview', type: 'video', duration: '6m', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: `${base}-2`, title: 'Foundations and Key Concepts', type: 'reading', duration: '10m', content: 'In this lesson we introduce the core ideas and vocabulary you will use throughout the course. Focus on mental models rather than memorizing terms.' },
    { id: `${base}-3`, title: 'Hands-on Demo', type: 'video', duration: '12m', url: 'https://www.youtube.com/embed/9bZkp7q19f0' },
    { id: `${base}-4`, title: 'Best Practices Checklist', type: 'reading', duration: '8m', content: 'Use this checklist while working on projects: clarity of problem, data quality, modular design, testing, and iteration cadence.' },
    { id: `${base}-5`, title: 'Project Brief', type: 'reading', duration: '7m', content: 'Your project: apply the concepts to build a small, focused artifact. Submit a short write-up including decisions and trade-offs.' },
  ]
  return lessons
}


