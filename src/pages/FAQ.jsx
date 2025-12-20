import React, { useState } from 'react';
import { Container, Row, Col, Accordion, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaSearch, FaQuestionCircle } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const FAQ = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const labels = {
    pt: {
      tag: 'PERGUNTAS FREQUENTES',
      title: 'FAQ',
      subtitle: 'Encontre respostas para as dúvidas mais comuns sobre o CP2B',
      searchPlaceholder: 'Buscar perguntas...',
      categories: {
        about: 'Sobre o CP2B',
        research: 'Pesquisa',
        collaboration: 'Colaboração',
        students: 'Estudantes e Oportunidades'
      },
      contact: 'Não encontrou sua resposta?',
      contactLink: 'Entre em contato conosco'
    },
    en: {
      tag: 'FREQUENTLY ASKED QUESTIONS',
      title: 'FAQ',
      subtitle: 'Find answers to the most common questions about CP2B',
      searchPlaceholder: 'Search questions...',
      categories: {
        about: 'About CP2B',
        research: 'Research',
        collaboration: 'Collaboration',
        students: 'Students and Opportunities'
      },
      contact: 'Didn\'t find your answer?',
      contactLink: 'Contact us'
    }
  }[language];

  const faqs = {
    pt: [
      {
        category: 'about',
        questions: [
          {
            q: 'O que é o CP2B?',
            a: 'O CP2B (Centro Paulista de Estudos em Biogás e Bioprodutos) é um centro de pesquisa financiado pela FAPESP, sediado no NIPE/UNICAMP. Nosso objetivo é desenvolver soluções inovadoras para a cadeia do biogás no Estado de São Paulo, abrangendo desde a pesquisa básica até a formulação de políticas públicas.'
          },
          {
            q: 'Qual é o período de atuação do projeto?',
            a: 'O projeto tem duração de 60 meses (5 anos), com início em fevereiro de 2025 e término previsto para 2030.'
          },
          {
            q: 'Quem financia o CP2B?',
            a: 'O centro é financiado pela FAPESP (Fundação de Amparo à Pesquisa do Estado de São Paulo) através do programa CCD - Centros de Ciências para o Desenvolvimento, processo nº 2024/01112-1.'
          },
          {
            q: 'Onde fica a sede do CP2B?',
            a: 'A sede do CP2B está localizada no Núcleo Interdisciplinar de Planejamento Energético (NIPE) da UNICAMP, na Rua Cora Coralina, 330, em Campinas, São Paulo.'
          }
        ]
      },
      {
        category: 'research',
        questions: [
          {
            q: 'Quais são os eixos temáticos de pesquisa?',
            a: 'O CP2B atua em 8 eixos temáticos: (1) Inventário de Resíduos e Mapeamento Tecnológico, (2) Ciência e Tecnologia de Base, (3) Engenharia de Processos e Bioprocessos, (4) Avaliação Integrada Socioeconômica, Ambiental e Energética, (5) Inovação em Bioprodutos, (6) Educação e Capacitação, (7) Difusão Científica e Comunicação, e (8) Políticas Públicas e Inovação Regulatória.'
          },
          {
            q: 'O que é o conceito de Laboratório Vivo?',
            a: 'O Laboratório Vivo (Living Lab) é uma abordagem que permite testar soluções e tecnologias em ambientes reais. O CP2B opera neste modelo, desenvolvendo projetos experimentais em campo em parceria com empresas e instituições.'
          },
          {
            q: 'Qual é o potencial de biogás em São Paulo?',
            a: 'O Estado de São Paulo possui um potencial estimado de mais de 4,5 bilhões de m³ de biogás por ano, sendo que o setor sucroenergético representa mais de 50% deste potencial.'
          }
        ]
      },
      {
        category: 'collaboration',
        questions: [
          {
            q: 'Como posso colaborar com o CP2B?',
            a: 'Existem diversas formas de colaboração: parcerias de pesquisa, participação em projetos piloto, transferência de tecnologia, ou como instituição parceira. Entre em contato através do nosso formulário de contato ou diretamente por e-mail: nipe@nipe.unicamp.br'
          },
          {
            q: 'Quais empresas são parceiras do CP2B?',
            a: 'Atualmente, temos parcerias com COMGÁS, SABESP, COPERCANA, Amplum Biogás, entre outras. Também contamos com parceiros institucionais como SAASP, EMBRAPII, e instituições de pesquisa nacionais e internacionais.'
          },
          {
            q: 'É possível visitar as instalações do CP2B?',
            a: 'Sim, organizamos visitas científicas e técnicas. Para agendar uma visita, entre em contato pelo e-mail nipe@nipe.unicamp.br ou através do formulário de contato no site.'
          }
        ]
      },
      {
        category: 'students',
        questions: [
          {
            q: 'Há oportunidades para estudantes de graduação?',
            a: 'Sim! O CP2B oferece oportunidades de iniciação científica, estágios e participação em projetos de pesquisa. Fique atento à página de Oportunidades para vagas abertas.'
          },
          {
            q: 'Existem vagas para pós-graduação?',
            a: 'O centro conta com diversos pesquisadores orientadores que podem supervisionar projetos de mestrado e doutorado relacionados às temáticas do biogás e bioprodutos. Consulte a lista de pesquisadores na página da Equipe.'
          },
          {
            q: 'O CP2B oferece cursos de capacitação?',
            a: 'Sim, o Eixo 6 (Educação e Capacitação) é dedicado à formação profissional. Oferecemos cursos, workshops e programas de capacitação técnica no setor de biogás.'
          }
        ]
      }
    ],
    en: [
      {
        category: 'about',
        questions: [
          {
            q: 'What is CP2B?',
            a: 'CP2B (São Paulo Center for Biogas and Bioproducts Studies) is a research center funded by FAPESP, headquartered at NIPE/UNICAMP. Our goal is to develop innovative solutions for the biogas chain in the State of São Paulo, ranging from basic research to public policy formulation.'
          },
          {
            q: 'What is the project duration?',
            a: 'The project has a duration of 60 months (5 years), starting in February 2025 and expected to end in 2030.'
          },
          {
            q: 'Who funds CP2B?',
            a: 'The center is funded by FAPESP (São Paulo Research Foundation) through the CCD - Science Centers for Development program, process nº 2024/01112-1.'
          },
          {
            q: 'Where is CP2B located?',
            a: 'CP2B is headquartered at the Interdisciplinary Center for Energy Planning (NIPE) at UNICAMP, Rua Cora Coralina, 330, in Campinas, São Paulo.'
          }
        ]
      },
      {
        category: 'research',
        questions: [
          {
            q: 'What are the research thematic axes?',
            a: 'CP2B operates across 8 thematic axes: (1) Waste Inventory and Technology Mapping, (2) Basic Science and Technology, (3) Process and Bioprocess Engineering, (4) Integrated Socioeconomic, Environmental and Energy Assessment, (5) Bioproduct Innovation, (6) Education and Training, (7) Scientific Dissemination and Communication, and (8) Public Policies and Regulatory Innovation.'
          },
          {
            q: 'What is the Living Lab concept?',
            a: 'The Living Lab is an approach that allows testing solutions and technologies in real environments. CP2B operates under this model, developing experimental field projects in partnership with companies and institutions.'
          },
          {
            q: 'What is the biogas potential in São Paulo?',
            a: 'The State of São Paulo has an estimated potential of over 4.5 billion m³ of biogas per year, with the sugar-energy sector representing over 50% of this potential.'
          }
        ]
      },
      {
        category: 'collaboration',
        questions: [
          {
            q: 'How can I collaborate with CP2B?',
            a: 'There are several forms of collaboration: research partnerships, participation in pilot projects, technology transfer, or as a partner institution. Contact us through our contact form or directly via email: nipe@nipe.unicamp.br'
          },
          {
            q: 'Which companies are CP2B partners?',
            a: 'Currently, we have partnerships with COMGÁS, SABESP, COPERCANA, Amplum Biogás, among others. We also have institutional partners such as SAASP, EMBRAPII, and national and international research institutions.'
          },
          {
            q: 'Is it possible to visit CP2B facilities?',
            a: 'Yes, we organize scientific and technical visits. To schedule a visit, contact us via email nipe@nipe.unicamp.br or through the contact form on the website.'
          }
        ]
      },
      {
        category: 'students',
        questions: [
          {
            q: 'Are there opportunities for undergraduate students?',
            a: 'Yes! CP2B offers opportunities for scientific initiation, internships, and participation in research projects. Check the Opportunities page for open positions.'
          },
          {
            q: 'Are there graduate positions available?',
            a: 'The center has several supervising researchers who can supervise master\'s and doctoral projects related to biogas and bioproducts topics. Check the list of researchers on the Team page.'
          },
          {
            q: 'Does CP2B offer training courses?',
            a: 'Yes, Axis 6 (Education and Training) is dedicated to professional development. We offer courses, workshops, and technical training programs in the biogas sector.'
          }
        ]
      }
    ]
  }[language];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Filter FAQs based on search
  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Container className="py-5">
        {/* Page Header */}
        <Row className="mb-5 page-header">
          <Col lg={8}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <span className="mono-label text-petrol">{labels.tag}</span>
              <h1 className="display-5 fw-bold mb-4">{labels.title}</h1>
              <p className="lead">{labels.subtitle}</p>
            </motion.div>
          </Col>
        </Row>

        {/* Search */}
        <Row className="mb-5">
          <Col lg={6}>
            <div className="position-relative">
              <FaSearch
                className="position-absolute text-muted"
                style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <Form.Control
                type="text"
                placeholder={labels.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-5 py-3"
                style={{ borderRadius: 'var(--radius-full)' }}
              />
            </div>
          </Col>
        </Row>

        {/* FAQ Categories */}
        {filteredFaqs.map((category, catIndex) => (
          <motion.section
            key={category.category}
            className="mb-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
          >
            <div className="d-flex align-items-center gap-3 mb-4">
              <FaQuestionCircle style={{ color: 'var(--cp2b-petrol)' }} />
              <h3 className="fw-bold mb-0" style={{ fontSize: '1.1rem' }}>
                {labels.categories[category.category]}
              </h3>
            </div>

            <Accordion flush>
              {category.questions.map((faq, index) => (
                <Accordion.Item
                  key={index}
                  eventKey={`${category.category}-${index}`}
                  className="mb-2"
                  style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
                >
                  <Accordion.Header>
                    <span className="fw-semibold">{faq.q}</span>
                  </Accordion.Header>
                  <Accordion.Body className="text-muted" style={{ lineHeight: 1.75 }}>
                    {faq.a}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </motion.section>
        ))}

        {/* Contact CTA */}
        <motion.div
          className="text-center mt-5 pt-5 border-top"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <p className="text-muted mb-2">{labels.contact}</p>
          <a
            href="/contato"
            className="btn btn-outline-primary rounded-pill px-4"
          >
            {labels.contactLink}
          </a>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default FAQ;
