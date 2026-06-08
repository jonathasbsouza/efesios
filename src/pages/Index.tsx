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
import { Menu, ExternalLink } from 'lucide-react';

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

const splitMarkdownByH2 = (content: string) => {
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    return [];
  }

  const lines = trimmedContent.split('\n');
  const sections: string[] = [];
  let currentSection: string[] = [];

  lines.forEach((line) => {
    const isH2 = /^##\s+/.test(line.trim());

    if (isH2 && currentSection.length > 0) {
      sections.push(currentSection.join('\n').trim());
      currentSection = [line];
      return;
    }

    currentSection.push(line);
  });

  if (currentSection.length > 0) {
    sections.push(currentSection.join('\n').trim());
  }

  return sections.filter(Boolean);
};

const NavSidebar = () => {
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-border">
        <h1 className="text-lg font-bold text-foreground tracking-wide uppercase">
          Pratique a Ressurreição
        </h1>
        <p className="text-sm mt-2 font-mono lowercase text-[hsl(var(--lesson-accent))]">
          estudos na carta aos Efésios
        </p>
      </SidebarHeader>
      <SidebarContent className="p-0">
        <ScrollArea className="flex-1">
          <nav className="mt-6">
            <div className="px-6 py-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                    <span className="text-xs bg-secondary text-muted-foreground whitespace-nowrap px-2 py-1 rounded border border-border">
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
  const lessonSections = React.useMemo(
    () => splitMarkdownByH2(lesson?.content ?? ''),
    [lesson?.content],
  );

  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
  }, [slug]);

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Aula não encontrada
          </h1>
          <p className="text-muted-foreground">
            Não foi possível encontrar a aula especificada.
          </p>
        </div>
      </div>
    );
  }

  if (lesson.status === 'unavailable') {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Em breve</h1>
          <p className="text-muted-foreground">
            Esta aula ainda não está disponível. Verifique novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
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
              <div className="w-full aspect-video bg-muted/40 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center px-4">
                  <div className="text-muted-foreground mb-2">
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
                  <p className="text-muted-foreground font-medium">
                    Nenhum slide disponível
                  </p>
                  <p className="text-muted-foreground/80 text-sm">
                    Apresentação será disponibilizada em breve.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            {lessonSections.map((section, index) => (
              <div
                key={`${lesson.slug}-section-${index}`}
                className="lesson-content bg-card text-card-foreground rounded-lg shadow-sm border border-border p-8"
              >
                <ReactMarkdown
                  components={{
                    a: ({ href, children }) => {
                      const isExternal = href?.startsWith('http') || href?.startsWith('//');
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lesson-link"
                        >
                          {children}
                          {isExternal && (
                            <ExternalLink className="lesson-link-icon" aria-hidden="true" />
                          )}
                        </a>
                      );
                    },
                  }}
                >
                  {section}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

const Header = () => (
  <header className="flex h-14 items-center gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 md:hidden">
    <div className="flex-1">
      <SidebarTrigger variant="outline" size="icon">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </SidebarTrigger>
    </div>
  </header>
);

const Index = () => {
  const firstAvailableLesson = lessonsData.find(
    (lesson) => lesson.status === 'available',
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background justify-center">
        <NavSidebar />
        <SidebarInset>
          <Header />
            <Routes>
              <Route
                path="/"
                element={
                  firstAvailableLesson ? (
                    <Navigate
                      to={`/aula/${firstAvailableLesson.slug}`}
                      replace
                    />
                  ) : (
                    <div className="flex-1 flex min-w-40 items-center justify-center bg-background px-4">
                      <div className="text-center">
                        <p className="text-muted-foreground">
                          Nenhuma aula disponível no momento.
                        </p>
                        <p className="text-sm text-muted-foreground/70 mt-2">
                          Total no catálogo: {lessonsData.length}
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