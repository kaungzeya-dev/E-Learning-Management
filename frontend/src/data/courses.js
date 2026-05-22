// Centralized mock course catalog (18 total)
export const COURSES = [
  { id: 1,  title: 'Web Application Development', instructor: 'Dr. Sarah Johnson', rating: 4.8, students: 12500, price: 'Free', level: 'Beginner', duration: '6 weeks', category: 'Computer Science', thumbnail: '🌐', color: '#667eea', summary: 'Build modern web apps using HTML, CSS, and JavaScript.' },
  { id: 2,  title: 'Machine Learning Fundamentals', instructor: 'Prof. Michael Chen', rating: 4.9, students: 25000, price: 'Free', level: 'Intermediate', duration: '8 weeks', category: 'Data Science', thumbnail: '🤖', color: '#f093fb', summary: 'Core ML concepts, models, and evaluation techniques.' },
  { id: 3,  title: 'Digital Marketing Strategy', instructor: 'Emma Williams', rating: 4.7, students: 8900, price: 'Free', level: 'Beginner', duration: '4 weeks', category: 'Business', thumbnail: '📱', color: '#4facfe', summary: 'Plan, execute, and measure digital marketing campaigns.' },
  { id: 4,  title: 'Python for Data Science', instructor: 'Dr. James Lee', rating: 4.8, students: 18000, price: 'Free', level: 'Beginner', duration: '5 weeks', category: 'Data Science', thumbnail: '🐍', color: '#43e97b', summary: 'Data analysis with Python, pandas, and visualization.' },
  { id: 5,  title: 'UI/UX Design Principles', instructor: 'Lisa Anderson', rating: 4.9, students: 15000, price: 'Free', level: 'Beginner', duration: '6 weeks', category: 'Design', thumbnail: '🎨', color: '#fa709a', summary: 'Human-centered design, wireframes, and prototyping.' },
  { id: 6,  title: 'Cloud Computing with AWS', instructor: 'Robert Martinez', rating: 4.7, students: 10500, price: 'Free', level: 'Advanced', duration: '10 weeks', category: 'Computer Science', thumbnail: '☁️', color: '#a8edea', summary: 'AWS core services, architectures, and best practices.' },
  { id: 7,  title: 'Financial Markets', instructor: 'Prof. David Brown', rating: 4.8, students: 22000, price: 'Free', level: 'Beginner', duration: '7 weeks', category: 'Business', thumbnail: '💰', color: '#ffecd2', summary: 'Market structures, instruments, and investment basics.' },
  { id: 8,  title: 'Mobile App Development', instructor: 'Jennifer Taylor', rating: 4.6, students: 9800, price: 'Free', level: 'Intermediate', duration: '8 weeks', category: 'Computer Science', thumbnail: '📱', color: '#ff9a9e', summary: 'Cross-platform mobile app development foundations.' },
  { id: 9,  title: 'Data Visualization with D3.js', instructor: 'Noah Patel', rating: 4.6, students: 7200, price: 'Free', level: 'Intermediate', duration: '6 weeks', category: 'Data Science', thumbnail: '📊', color: '#84fab0', summary: 'Interactive visualizations and storytelling with D3.js.' },
  { id: 10, title: 'Agile Project Management', instructor: 'Sophia Garcia', rating: 4.7, students: 13400, price: 'Free', level: 'Beginner', duration: '4 weeks', category: 'Business', thumbnail: '📈', color: '#a6c0fe', summary: 'Scrum, Kanban, and agile delivery essentials.' },
  { id: 11, title: 'Advanced React Patterns', instructor: 'Ethan Moore', rating: 4.8, students: 16300, price: 'Free', level: 'Advanced', duration: '6 weeks', category: 'Computer Science', thumbnail: '⚛️', color: '#fbc2eb', summary: 'Hooks, context, performance, and architectural patterns.' },
  { id: 12, title: 'Intro to Cybersecurity', instructor: 'Ava Thompson', rating: 4.7, students: 9100, price: 'Free', level: 'Beginner', duration: '5 weeks', category: 'Computer Science', thumbnail: '🛡️', color: '#cfd9df', summary: 'Threats, defenses, and security fundamentals.' },
  { id: 13, title: 'SQL and Databases', instructor: 'William King', rating: 4.8, students: 20400, price: 'Free', level: 'Beginner', duration: '5 weeks', category: 'Data Science', thumbnail: '🗄️', color: '#fddb92', summary: 'Relational data models, SQL queries, and joins.' },
  { id: 14, title: 'Product Management 101', instructor: 'Mia Rivera', rating: 4.6, students: 6800, price: 'Free', level: 'Beginner', duration: '4 weeks', category: 'Business', thumbnail: '🧭', color: '#fee140', summary: 'Product strategy, discovery, and delivery lifecycle.' },
  { id: 15, title: 'Figma for Designers', instructor: 'Oliver Scott', rating: 4.7, students: 7700, price: 'Free', level: 'Beginner', duration: '3 weeks', category: 'Design', thumbnail: '🧩', color: '#f6d365', summary: 'Layouts, components, and collaboration in Figma.' },
  { id: 16, title: 'Natural Language Processing', instructor: 'Harper Nguyen', rating: 4.7, students: 8400, price: 'Free', level: 'Intermediate', duration: '7 weeks', category: 'Data Science', thumbnail: '🗣️', color: '#96e6a1', summary: 'Text preprocessing, embeddings, and sequence models.' },
  { id: 17, title: 'DevOps Foundations', instructor: 'Lucas Bennett', rating: 4.6, students: 11200, price: 'Free', level: 'Intermediate', duration: '6 weeks', category: 'Computer Science', thumbnail: '🔧', color: '#9face6', summary: 'CI/CD, containers, and infrastructure as code.' },
  { id: 18, title: 'Branding and Identity', instructor: 'Ella Brooks', rating: 4.5, students: 5600, price: 'Free', level: 'Beginner', duration: '4 weeks', category: 'Design', thumbnail: '🏷️', color: '#ffafbd', summary: 'Build brand systems and visual identities.' },
]

export function getCourseById(id) {
  return COURSES.find(c => String(c.id) === String(id)) || null;
}


