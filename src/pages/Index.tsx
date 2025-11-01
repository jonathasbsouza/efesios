import React from 'react';
import { Routes, Route, Navigate, NavLink, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Buffer } from 'buffer';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  useSidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

// Make Buffer globally available for gray-matter
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Import markdown files using Vite's import.meta.glob
const markdownModules = import.meta.glob('../lessons/*.md', {
  as: 'raw',
  eager: true,
});

// Loader function to parse markdown files with frontmatter
const loadLessonsFromMarkdown = () => {
  const lessons = Object.entries(markdownModules).map(([path, rawContent]) => {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    const { data, content } = matter(rawContent);
    return {
      slug,
      title: data.title,
      order: data.order,
      status: data.status,
      googleSlidesEmbedUrl: data.googleSlidesEmbedUrl,
      content,
    };
  });
  return lessons.sort((a, b) => a.order - b.order);
};

const lessonsData = loadLessonsFromMarkdown();

const NavSidebar = () => {
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">Vapor</h1>
        <p className="text-slate-400 text-sm mt-1">
          Estudos bíblicos em Eclesiastes
        </p>
      </SidebarHeader>
      <SidebarContent className="p-0">
        <ScrollArea className="flex-1">
          <nav className="mt-6">
            <div className="px-6 py-2">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Aulas
              </h2>
            </div>
            {lessonsData.map((lesson) => (
              <NavLink
                key={lesson.slug}
                to={`/aula/${lesson.slug}`}
                onClick={handleLinkClick}
                className={({ isActive }) => {
                  if (lesson.status === 'unavailable') {
                    return 'nav-link nav-link-unavailable';
                  }
                  return `nav-link ${
                    isActive ? 'nav-link-active' : 'nav-link-available'
                  }`;
                }}
              >
                <div className="flex items-center gap-2 justify-between">
                  <span>{lesson.title}</span>
                  {lesson.status === 'unavailable' && (
                    <span className="text-xs bg-slate-600 whitespace-nowrap px-2 py-1 rounded">
                      Em breve
                    </span>
                  )}
                </div>
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
};

const LessonDisplay = () => {
  const { slug } = useParams();
  const lesson = lessonsData.find((l) => l.slug === slug);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
  }, [slug]);

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Aula não encontrada
          </h1>
          <p className="text-gray-600">
            Não foi possível encontrar a aula especificada.
          </p>
        </div>
      </div>
    );
  }

  if (lesson.status === 'unavailable') {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Em breve</h1>
          <p className="text-gray-600">
            Esta aula ainda não está disponível. Verifique novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <ScrollArea
        className="h-full flex justify-center"
        viewportRef={viewportRef}
      >
        <div className="max-w-4xl mx-auto p-8 animate-fade-in">
          <h1 className="lesson-title">{lesson.title}</h1>
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
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">
                    Nenhum slide disponível
                  </p>
                  <p className="text-gray-400 text-sm">
                    Apresentação será disponibilizada em breve.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="lesson-content bg-white rounded-lg shadow-sm p-8">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

const Header = () => (
  <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
    <div className="flex-1">
      <SidebarTrigger variant="outline" size="icon">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </SidebarTrigger>
    </div>
  </header>
);

const Index = () => {
  const lastAvailableLesson = [...lessonsData]
    .reverse()
    .find((lesson) => lesson.status === 'available');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40 justify-center">
        <NavSidebar />
        <SidebarInset>
          <Header />
            <Routes>
              <Route
                path="/"
                element={
                  lastAvailableLesson ? (
                    <Navigate
                      to={`/aula/${lastAvailableLesson.slug}`}
                      replace
                    />
                  ) : (
                    <div className="flex-1 flex min-w-40 items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-600">
                          No lessons available at this time.
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Debug: Found {lessonsData.length} lessons total
                        </p>
                      </div>
                    </div>
                  )
                }
              />
              <Route path="/aula/:slug" element={<LessonDisplay />} />
            </Routes>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;