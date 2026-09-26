// Conteúdo da página /capacitacao — Cursos e Capacitação (Eixo 6).
//
// Fonte: "Template de Oferecimento de Curso – CP2b" (Eixo 6, ago/2026) e a
// chamada do Eixo 6 aos coordenadores de eixo por propostas de cursos de
// extensão e capacitação (set/2026). O curso-modelo é o exemplo oficial da
// seção 13 do template; os módulos de referência são os exemplos da seção 6.
//
// O arquivo para download é uma cópia do template sem os metadados ocultos do
// Google Docs (comentários da revisão interna); o conteúdo visível é idêntico.

export const courseTemplate = {
  href: '/assets/capacitacao/template-oferecimento-curso-cp2b.docx',
  fileName: 'Template de Oferecimento de Curso - CP2b.docx',
};

// Propostas e dúvidas vão para a diretoria, que conduz a chamada.
export const proposalsEmail = 'diretoria@cp2b.unicamp.br';

export const capacitacaoContent = {
  pt: {
    hero: {
      eyebrow: 'Eixo 6 · Educação e Capacitação',
      title: 'Cursos e Capacitação',
      subtitle:
        'Cursos de extensão e capacitação de 4 a 24 horas em biogás, biometano e bioprodutos, planejados pelos pesquisadores do CP2b para estudantes, profissionais e gestores públicos.',
      proposeCta: 'Propor um curso',
      modelCta: 'Ver o curso-modelo',
    },
    model: {
      badge: 'Curso-modelo',
      title: 'Biogás, Biometano e Bioprodutos para a Transição Energética',
      intro: 'Exemplo oficial do template de cursos: mostra o formato esperado de uma formação do CP2b.',
      hoursLabel: 'Carga horária',
      hours: '16 horas',
      hoursValue: '16',
      hoursUnit: 'horas',
      audienceLabel: 'Público',
      audience: ['Pesquisadores', 'Profissionais da indústria', 'Gestores públicos', 'Estudantes'],
      objectiveLabel: 'Objetivo',
      objective: 'Capacitar profissionais para atuar em projetos de biogás, biometano e valorização de resíduos.',
      outcomesLabel: 'Resultados esperados',
      outcomes: 'Formação de recursos humanos qualificados e fortalecimento do ecossistema de inovação do CP2b.',
      modulesTitle: 'Módulos de referência',
      modules: [
        'Introdução ao Biogás e Biometano',
        'Biomassa e Resíduos para Biodigestão',
        'Tecnologias de Produção e Upgrading',
        'Bioprodutos e Economia Circular',
        'Avaliação Econômica, Ambiental e Energética',
        'Políticas Públicas e Regulação',
        'Estudos de Caso Nacionais e Internacionais',
        'Visitas Técnicas ou Atividades Práticas',
      ],
      modulesNote: 'Módulos sugeridos no template. O programa de cada turma é definido na proposta do curso.',
      demoNote: 'Curso-modelo de demonstração, publicado como referência para novas propostas.',
      newsletterCta: 'Avise-me das turmas',
    },
    propose: {
      tag: 'PARA PESQUISADORES',
      title: 'Proponha um curso',
      lead:
        'O Eixo 6 convida os pesquisadores do CP2b a propor cursos de extensão e capacitação. Cada curso amplia o networking e a visibilidade do Centro e gera receita para quem o ministra e para o CP2b.',
      formats: [
        { icon: 'bi-hourglass-split', title: 'De 4 a 24 horas', text: 'Formações curtas, do minicurso ao curso de extensão.' },
        { icon: 'bi-laptop', title: 'Presencial, online ou híbrido', text: 'A modalidade é definida na proposta.' },
        { icon: 'bi-people', title: 'Equipe ampliada', text: 'Inclua pós-doutorandos e alunos de doutorado.' },
        { icon: 'bi-bank', title: 'Com outras instituições', text: 'Divida o curso com colegas de outras unidades e universidades.' },
        { icon: 'bi-briefcase', title: 'In company e parcerias', text: 'Turmas para empresas ou com parceiros organizacionais.' },
      ],
      stepsTitle: 'Como enviar',
      steps: [
        { title: 'Baixe o template', text: 'O modelo oficial em Word traz as 13 seções da proposta, com exemplos.' },
        {
          title: 'Preencha a proposta',
          text: 'Descreva objetivos, público, conteúdo, cronograma e orçamento. Para a remuneração, o template sugere como referência a hora-aula da Extecamp.',
        },
        { title: 'Envie à diretoria', text: 'Mande o arquivo preenchido para' },
      ],
      download: {
        kicker: 'Modelo oficial',
        title: 'Template de Oferecimento de Curso – CP2b',
        meta: ['Word (.docx)', '2,3 MB', '13 seções'],
        button: 'Baixar template',
        mail: 'Enviar proposta por e-mail',
        mailSubject: 'Proposta de curso – CP2b',
        languageNote: '',
      },
    },
    outline: {
      tag: 'ESTRUTURA DA PROPOSTA',
      title: 'O que o template pede',
      lead: 'Confira antes de começar: são estas as seções que a proposta precisa responder.',
      sections: [
        { title: 'Identificação do curso', text: 'Título, eixo temático, modalidade, carga horária, período, local, responsável, equipe e parceiros institucionais.' },
        { title: 'Resumo executivo', text: 'Objetivos, relevância e alinhamento com a missão do CP2b, em poucas linhas.' },
        { title: 'Público-alvo', text: 'Perfil dos participantes, número mínimo e máximo de vagas e pré-requisitos.' },
        { title: 'Objetivos de aprendizagem', text: 'Objetivo geral e objetivos específicos do curso.' },
        { title: 'Justificativa', text: 'Relevância para biogás, biometano, bioprodutos, transição energética, economia circular ou desenvolvimento sustentável.' },
        { title: 'Conteúdo programático', text: 'Módulos com tema, carga horária, responsável e competências desenvolvidas.' },
        { title: 'Metodologia', text: 'Aulas expositivas, estudos de caso, oficinas, visitas técnicas, laboratório, webinars, mesas-redondas ou projeto aplicado.' },
        { title: 'Cronograma', text: 'Data, tema, responsável e carga horária de cada encontro.' },
        { title: 'Infraestrutura necessária', text: 'Sala, laboratório, plataforma online, equipamentos audiovisuais, material didático e suporte técnico.' },
        { title: 'Indicadores de sucesso', text: 'Participantes, taxa de conclusão, avaliação de satisfação, certificados emitidos e parcerias geradas.' },
        { title: 'Orçamento', text: 'Receitas previstas, custos operacionais e resultado financeiro estimado.' },
        { title: 'Divulgação', text: 'Canais — site, redes sociais, mailing, universidades, empresas e associações setoriais — e cronograma.' },
        { title: 'Exemplo de curso CP2b', text: 'Um curso-modelo preenchido, para servir de referência.', anchor: '#curso-modelo' },
      ],
      exampleLink: 'Ver o curso-modelo',
    },
    contact: {
      coordTitle: 'Coordenação do Eixo 6',
      axisLink: 'Conheça o Eixo 6',
      title: 'Dúvidas sobre uma proposta?',
      lead: 'Fale com a diretoria do CP2b pelo e-mail da chamada.',
      button: 'Enviar e-mail',
    },
  },
  en: {
    hero: {
      eyebrow: 'Axis 6 · Education and Training',
      title: 'Courses and Training',
      subtitle:
        'Extension and training courses of 4 to 24 hours on biogas, biomethane and bioproducts, designed by CP2b researchers for students, professionals and public managers.',
      proposeCta: 'Propose a course',
      modelCta: 'See the model course',
    },
    model: {
      badge: 'Model course',
      title: 'Biogas, Biomethane and Bioproducts for the Energy Transition',
      intro: 'The official example from the course template, showing the expected format of a CP2b training programme.',
      hoursLabel: 'Workload',
      hours: '16 hours',
      hoursValue: '16',
      hoursUnit: 'hours',
      audienceLabel: 'Audience',
      audience: ['Researchers', 'Industry professionals', 'Public managers', 'Students'],
      objectiveLabel: 'Objective',
      objective: 'To train professionals to work on biogas, biomethane and waste valorisation projects.',
      outcomesLabel: 'Expected outcomes',
      outcomes: 'Qualified human resources and a stronger CP2b innovation ecosystem.',
      modulesTitle: 'Reference modules',
      modules: [
        'Introduction to Biogas and Biomethane',
        'Biomass and Waste for Anaerobic Digestion',
        'Production and Upgrading Technologies',
        'Bioproducts and the Circular Economy',
        'Economic, Environmental and Energy Assessment',
        'Public Policy and Regulation',
        'National and International Case Studies',
        'Technical Visits or Hands-on Activities',
      ],
      modulesNote: 'Modules suggested in the template. The programme of each class is set in the course proposal.',
      demoNote: 'Demonstration model course, published as a reference for new proposals.',
      newsletterCta: 'Notify me about classes',
    },
    propose: {
      tag: 'FOR RESEARCHERS',
      title: 'Propose a course',
      lead:
        "Axis 6 invites CP2b researchers to propose extension and training courses. Each course broadens the Centre's network and visibility and generates income for the people who teach it and for CP2b.",
      formats: [
        { icon: 'bi-hourglass-split', title: 'From 4 to 24 hours', text: 'Short programmes, from mini-courses to extension courses.' },
        { icon: 'bi-laptop', title: 'In person, online or hybrid', text: 'The format is set in the proposal.' },
        { icon: 'bi-people', title: 'A broader team', text: 'Include postdocs and PhD students.' },
        { icon: 'bi-bank', title: 'With other institutions', text: 'Share the course with colleagues from other units and universities.' },
        { icon: 'bi-briefcase', title: 'In-company and partnerships', text: 'Classes for companies or with organisational partners.' },
      ],
      stepsTitle: 'How to submit',
      steps: [
        { title: 'Download the template', text: 'The official Word form covers the 13 sections of the proposal, with examples.' },
        {
          title: 'Fill in the proposal',
          text: 'Describe objectives, audience, content, schedule and budget. For fees, the template suggests the Extecamp hourly rate as a reference.',
        },
        { title: 'Send it to the board', text: 'Email the completed file to' },
      ],
      download: {
        kicker: 'Official form',
        title: 'Course Offering Template – CP2b',
        meta: ['Word (.docx)', '2.3 MB', '13 sections'],
        button: 'Download template',
        mail: 'Send a proposal by email',
        mailSubject: 'Course proposal – CP2b',
        languageNote: 'The template is in Portuguese.',
      },
    },
    outline: {
      tag: 'PROPOSAL STRUCTURE',
      title: 'What the template asks for',
      lead: 'Check before you start: these are the sections your proposal needs to cover.',
      sections: [
        { title: 'Course identification', text: 'Title, thematic axis, format, workload, dates, venue, lead, team and institutional partners.' },
        { title: 'Executive summary', text: "Objectives, relevance and fit with CP2b's mission, in a few lines." },
        { title: 'Target audience', text: 'Participant profile, minimum and maximum number of places, and prerequisites.' },
        { title: 'Learning objectives', text: 'General and specific objectives of the course.' },
        { title: 'Rationale', text: 'Relevance to biogas, biomethane, bioproducts, the energy transition, the circular economy or sustainable development.' },
        { title: 'Syllabus', text: 'Modules with topic, workload, lead and competences developed.' },
        { title: 'Methodology', text: 'Lectures, case studies, workshops, technical visits, lab work, webinars, round tables or an applied project.' },
        { title: 'Schedule', text: 'Date, topic, lead and workload of each session.' },
        { title: 'Required infrastructure', text: 'Classroom, laboratory, online platform, audiovisual equipment, teaching materials and technical support.' },
        { title: 'Success indicators', text: 'Participants, completion rate, satisfaction survey, certificates issued and partnerships generated.' },
        { title: 'Budget', text: 'Expected revenue, operating costs and estimated financial result.' },
        { title: 'Outreach', text: 'Channels — website, social media, mailing lists, universities, companies and industry associations — and schedule.' },
        { title: 'CP2b course example', text: 'A completed model course, to serve as a reference.', anchor: '#curso-modelo' },
      ],
      exampleLink: 'See the model course',
    },
    contact: {
      coordTitle: 'Axis 6 coordination',
      axisLink: 'About Axis 6',
      title: 'Questions about a proposal?',
      lead: 'Contact the CP2b board at the call email address.',
      button: 'Send an email',
    },
  },
};
