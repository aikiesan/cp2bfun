/**
 * Subárvore de rotas do painel administrativo, isolada em seu próprio chunk.
 *
 * O admin carrega o editor de texto rico (quill), o drag-and-drop e o
 * compressor de imagens — cerca de 690 KB (≈180 KB gzip) de código que nenhum
 * visitante do site público usa. Reunindo tudo aqui, o App.jsx precisa de um
 * único limite React.lazy e o Rollup consegue mover essas dependências para um
 * chunk que só é baixado quando alguém abre /admin.
 *
 * Os caminhos são relativos a /admin: a rota splat do App.jsx os resolve
 * (o Router já roda com v7_relativeSplatPath).
 */
import { Routes, Route } from 'react-router-dom';

import {
  AdminLayout,
  Dashboard,
  NewsList,
  NewsEditor,
  VideosList,
  VideosEditor,
  TeamEditor,
  AxesEditor,
  MessagesPanel,
  PartnersEditor,
  PublicationsList,
  PublicationsEditor,
  MicroscopioList,
  MicroscopioEditor,
  ProjectsList,
  ProjectsEditor,
  ParticipantsPanel,
  MeetupSlotsManager,
  MeetupRequestsPanel,
  ForumDashboard,
  NewsletterPanel,
  OportunidadesList,
  OportunidadesEditor,
  GalleryList,
  GalleryUpload,
  PressKitAdmin,
  PodcastList,
  PodcastEditor,
  BoletinsAdmin,
  PageStatusManager,
  EventsList,
  EventsEditor,
  SiteSettingsAdmin,
  AjudaAdmin,
} from './pages/admin';
import FeaturedContentManager from './pages/admin/FeaturedContentManager';
import {
  HomeContentEditor,
  AboutContentEditor,
  GovernanceContentEditor,
  TransparencyContentEditor,
  MicroscopioContentEditor
} from './pages/admin/content';

const AdminApp = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="news" element={<NewsList />} />
      <Route path="news/new" element={<NewsEditor />} />
      <Route path="news/:slug" element={<NewsEditor />} />
      <Route path="videos" element={<VideosList />} />
      <Route path="videos/new" element={<VideosEditor />} />
      <Route path="videos/:id" element={<VideosEditor />} />
      <Route path="featured" element={<FeaturedContentManager />} />
      <Route path="publications" element={<PublicationsList />} />
      <Route path="publications/new" element={<PublicationsEditor />} />
      <Route path="publications/:id" element={<PublicationsEditor />} />
      <Route path="microscopio" element={<MicroscopioList />} />
      <Route path="microscopio/new" element={<MicroscopioEditor />} />
      <Route path="microscopio/:slug" element={<MicroscopioEditor />} />
      <Route path="projects" element={<ProjectsList />} />
      <Route path="projects/new" element={<ProjectsEditor />} />
      <Route path="projects/:slug" element={<ProjectsEditor />} />
      <Route path="team" element={<TeamEditor />} />
      <Route path="axes" element={<AxesEditor />} />
      <Route path="content/home" element={<HomeContentEditor />} />
      <Route path="content/about" element={<AboutContentEditor />} />
      <Route path="content/governance" element={<GovernanceContentEditor />} />
      <Route path="content/transparency" element={<TransparencyContentEditor />} />
      <Route path="content/microscopio" element={<MicroscopioContentEditor />} />
      <Route path="partners" element={<PartnersEditor />} />
      <Route path="messages" element={<MessagesPanel />} />
      <Route path="forum" element={<ForumDashboard />} />
      <Route path="forum/participants" element={<ParticipantsPanel />} />
      <Route path="forum/slots"        element={<MeetupSlotsManager />} />
      <Route path="forum/meetups"      element={<MeetupRequestsPanel />} />
      <Route path="newsletter"         element={<NewsletterPanel />} />
      <Route path="oportunidades"      element={<OportunidadesList />} />
      <Route path="oportunidades/new"  element={<OportunidadesEditor />} />
      <Route path="oportunidades/:slug" element={<OportunidadesEditor />} />
      <Route path="gallery"        element={<GalleryList />} />
      <Route path="gallery/upload" element={<GalleryUpload />} />
      <Route path="press-kit"      element={<PressKitAdmin />} />
      <Route path="podcast"        element={<PodcastList />} />
      <Route path="podcast/new"    element={<PodcastEditor />} />
      <Route path="podcast/:id"    element={<PodcastEditor />} />
      <Route path="boletins"       element={<BoletinsAdmin />} />
      <Route path="page-status"    element={<PageStatusManager />} />
      <Route path="events"         element={<EventsList />} />
      <Route path="events/new"     element={<EventsEditor />} />
      <Route path="events/:id"     element={<EventsEditor />} />
      <Route path="settings"       element={<SiteSettingsAdmin />} />
      <Route path="ajuda"          element={<AjudaAdmin />} />
    </Route>
  </Routes>
);

export default AdminApp;
