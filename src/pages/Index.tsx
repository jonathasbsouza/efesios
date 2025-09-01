import React from 'react';
import { Routes, Route, Navigate, NavLink, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Buffer } from 'buffer';

// Make Buffer globally available for gray-matter
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Raw markdown content with frontmatter (simulating imported .md files)
const rawMarkdownFiles = {
  'introduction-to-ecclesiastes': `---
title: '1. Introduction to Ecclesiastes'
order: 1
status: 'available'
googleSlidesEmbedUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vQY8xVxN-5K9Q3ZQ4kY8X2YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3/embed?start=false&loop=false&delayms=3000'
---

## 📝 To Memorize
"A generation goes, and a generation comes, but the earth remains forever. The sun rises, and the sun goes down, and hastens to the place where it rises."

**Ecclesiastes 1:4-5 ESV**

## 🔑 Keywords
- **hevel:** "vanity, breath, vapor" - The central concept of Ecclesiastes, describing the fleeting nature of earthly pursuits
- **yitron:** "profit, advantage" - What lasting benefit can be gained from human endeavor?
- **tahat hashamesh:** "under the sun" - The perspective of life viewed from earthly, temporal concerns

## 📚 Supplementary Material
- An overview of Ecclesiastes: [https://www.youtube.com/watch?v=E-nMyBL46bQ](https://www.youtube.com/watch?v=E-nMyBL46bQ)
- Ecclesiastes and Postmodernism: [https://relevantmagazine.com/faith/what-ecclesiastes-can-teach-us-about-post-modernism/](https://relevantmagazine.com/faith/what-ecclesiastes-can-teach-us-about-post-modernism/)

## 🎬 In Culture
The Byrds, "Turn! Turn! Turn!": [https://www.youtube.com/watch?v=pKP4cfU28vM](https://www.youtube.com/watch?v=pKP4cfU28vM)

## ✅ To-Do
Leave 3-4 comments on the document below analyzing the themes of meaninglessness in modern life.
[https://docs.google.com/document/d/12345/edit](https://docs.google.com/document/d/12345/edit)`,

  'vanity-of-vanities': `---
title: '2. Vanity of Vanities'
order: 2
status: 'available'
googleSlidesEmbedUrl: ''
---

## 📝 To Memorize
"Vanity of vanities, says the Preacher, vanity of vanities! All is vanity."

**Ecclesiastes 1:2 ESV**

## 🔑 Keywords
- **hebel hebalim:** "vanity of vanities" - The superlative form emphasizing ultimate meaninglessness
- **qohelet:** "preacher, gatherer" - The title of the speaker in Ecclesiastes
- **kol:** "all, everything" - The comprehensive scope of the vanity

## 📚 Supplementary Material
- The Philosophy of Ecclesiastes: [https://www.thegospelcoalition.org/article/philosophy-ecclesiastes/](https://www.thegospelcoalition.org/article/philosophy-ecclesiastes/)
- Ecclesiastes in Jewish Thought: [https://www.myjewishlearning.com/article/ecclesiastes-qohelet/](https://www.myjewishlearning.com/article/ecclesiastes-qohelet/)

## 🎬 In Culture
Pink Floyd's "Time" echoes Ecclesiastical themes: [https://www.youtube.com/watch?v=JwYX52BP2Sk](https://www.youtube.com/watch?v=JwYX52BP2Sk)

## ✅ To-Do
Write a 500-word reflection on how the concept of "hebel" applies to modern consumer culture.
[https://docs.google.com/document/d/67890/edit](https://docs.google.com/document/d/67890/edit)`,

  'time-and-seasons': `---
title: '3. A Time for Everything'
order: 3
status: 'unavailable'
googleSlidesEmbedUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vQY8xVxN-5K9Q3ZQ4kY8X2YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3YXZ3/embed?start=false&loop=false&delayms=3000'
---

## 📝 To Memorize
"To every thing there is a season, and a time to every purpose under the heaven."

**Ecclesiastes 3:1 KJV**

## 🔑 Keywords
- **zeman:** "time, season" - Appointed time for specific activities
- **eth:** "time" - The right or proper time
- **chephets:** "purpose, delight" - Divine intention behind timing

## 📚 Supplementary Material
- The Wisdom of Timing: [https://www.desiringgod.org/articles/theres-a-time-for-everything](https://www.desiringgod.org/articles/theres-a-time-for-everything)
- Ecclesiastes 3 Commentary: [https://www.biblestudytools.com/commentaries/gills-exposition-of-the-bible/ecclesiastes-3-1.html](https://www.biblestudytools.com/commentaries/gills-exposition-of-the-bible/ecclesiastes-3-1.html)

## 🎬 In Culture
The Byrds immortalized this passage in their hit song "Turn! Turn! Turn!"

## ✅ To-Do
This lesson will be available next week. Check back soon!`
};

// Loader function to parse markdown files with frontmatter
const loadLessonsFromMarkdown = () => {
  const lessons = Object.entries(rawMarkdownFiles).map(([slug, rawContent]) => {
    const { data, content } = matter(rawContent);
    
    return {
      slug,
      title: data.title,
      order: data.order,
      status: data.status,
      googleSlidesEmbedUrl: data.googleSlidesEmbedUrl,
      content
    };
  });

  // Sort by order field from frontmatter
  return lessons.sort((a, b) => a.order - b.order);
};

// Load and parse the lessons data
const lessonsData = loadLessonsFromMarkdown();

// Sidebar Navigation Component
const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-800 min-h-screen shadow-xl flex flex-col">
      <div className="p-6 border-b border-slate-700 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">Course Platform</h1>
        <p className="text-slate-400 text-sm mt-1">Ecclesiastes Study</p>
      </div>
      
      <ScrollArea className="flex-1">
        <nav className="mt-6">
          <div className="px-6 py-2">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lessons</h2>
          </div>
          
          {lessonsData.map((lesson) => (
            <NavLink
              key={lesson.slug}
              to={`/lessons/${lesson.slug}`}
              className={({ isActive }) => {
                if (lesson.status === 'unavailable') {
                  return 'nav-link nav-link-unavailable';
                }
                return `nav-link ${isActive ? 'nav-link-active' : 'nav-link-available'}`;
              }}
            >
              <div className="flex items-center justify-between">
                <span>{lesson.title}</span>
                {lesson.status === 'unavailable' && (
                  <span className="text-xs bg-slate-600 px-2 py-1 rounded">Soon</span>
                )}
              </div>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
};

// Lesson Display Component
const LessonDisplay = () => {
  const { slug } = useParams();
  const lesson = lessonsData.find(l => l.slug === slug);

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600">The requested lesson could not be found.</p>
        </div>
      </div>
    );
  }

  if (lesson.status === 'unavailable') {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Coming Soon</h1>
          <p className="text-gray-600">This lesson is not yet available. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <ScrollArea className="h-screen">
        <div className="max-w-4xl mx-auto p-8 animate-fade-in">
          <h1 className="lesson-title">{lesson.title}</h1>
          
          {/* Google Slides Embed or Empty State */}
          <div className="slides-container mb-12">
            {lesson.googleSlidesEmbedUrl ? (
              <iframe
                src={lesson.googleSlidesEmbedUrl}
                allowFullScreen
                title={`${lesson.title} Slides`}
              />
            ) : (
              <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No slides available</p>
                  <p className="text-gray-400 text-sm">Slides will be added soon</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Markdown Content */}
          <div className="lesson-content bg-white rounded-lg shadow-sm p-8">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Main Course Page Component
const Index = () => {
  // Find the first available lesson for default redirect
  const firstAvailableLesson = lessonsData.find(lesson => lesson.status === 'available');

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <Routes>
        <Route 
          path="/" 
          element={
            firstAvailableLesson ? 
              <Navigate to={`/lessons/${firstAvailableLesson.slug}`} replace /> :
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-600">No lessons available at this time.</p>
              </div>
          } 
        />
        <Route path="/lessons/:slug" element={<LessonDisplay />} />
      </Routes>
    </div>
  );
};

export default Index;
