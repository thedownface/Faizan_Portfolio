// Single source for resume content shown on the site (from Faizan_Khan_Resume.pdf).
export const PROFILE = {
  name: 'Faizan Khan',
  title: 'Senior Data Engineer',
  focus: 'Lakehouse, Streaming & Knowledge Graph Platforms',
  phone: '+91 9113250660',
  email: 'faizankhanbusinezz@gmail.com',
  github: 'https://github.com/thedownface',
  linkedin: 'https://linkedin.com/in/faizan-khan-a64443213',
  instagram: 'https://instagram.com/faizan.sw',
  resume: '/Faizan_Khan_Resume.pdf',
  summary:
    'Senior Data Engineer with 4 years designing and owning cloud lakehouse platforms, batch and streaming pipelines, and knowledge graphs for high-stakes, real-time domains.',
  stats: [
    ['4 YRS', 'IN PRODUCTION DATA'],
    ['70+', 'ENGINEERS ON GROOT'],
    ['$50K', 'SAVED PER YEAR'],
  ],
};

// Story chapters keyed to timeline time (seconds), shown in the corner while scrolling.
export const ERAS = [
  { from: 0, to: 15, when: 'BANGALORE · 4 YEARS', role: 'SENIOR DATA ENGINEER' },
  { from: 15, to: 22.8, when: 'STONEX · 2023 – 2024', role: 'INGEST · CDC STREAMING' },
  { from: 22.8, to: 30.4, when: 'STONEX · 2023 – 2024', role: 'MEDALLION LAKEHOUSE' },
  { from: 30.4, to: 35.7, when: 'CRAFTLABS · 2026 – NOW', role: 'KNOWLEDGE GRAPH' },
  { from: 35.7, to: 40, when: 'CRAFTLABS · 2026 – NOW', role: 'MCP SERVING LAYER' },
  { from: 40, to: 49.7, when: 'STONEX · 2025 – 2026', role: 'AGENTIC AI · GROOT' },
  { from: 49.7, to: 54.8, when: 'TOOLKIT', role: 'SKILLS · CERTS · AWARDS' },
];

export const EXPERIENCE = [
  {
    role: 'Software Engineer – Data + AI',
    org: 'Craftlabs',
    when: 'Jul 2026 – Present',
    points: [
      'Designing a USDM-compliant knowledge graph in Stardog — ontologies for clinical study entities so data from many source systems resolves into one queryable graph for client GSK.',
      'Building the end-to-end pipeline on Databricks and Azure Data Factory: Source → Raw → Foundation → Trusted → Knowledge Graph, with spec-driven development.',
      'Building an MCP server over the graph, exposing trusted, governed data as tools for LLMs and AI agents.',
    ],
  },
  {
    role: 'Staff Data Engineer',
    org: 'StoneX Group Inc.',
    when: 'Jan 2025 – Jul 2026',
    points: [
      'Architected and led GROOT, a LangGraph multi-agent platform across Databricks, ServiceNow, Confluence and Datadog for incident investigation, root-cause analysis and job monitoring — adopted by 70+ engineers.',
      'Built FinOps tooling surfacing cluster, job and SQL warehouse cost, driving proactive Databricks cost optimization.',
    ],
  },
  {
    role: 'Data Engineer',
    org: 'StoneX Group Inc.',
    when: 'Mar 2023 – Dec 2024',
    points: [
      'Redesigned the risk data platform as a CDC stream (Debezium → Redpanda → Structured Streaming): 180+ columns down to 60, latency from 15–25 minutes to near real-time.',
      'Migrated 20+ StreamSets pipelines to a Databricks Medallion lakehouse on Delta Lake, decommissioning the platform and cutting $50K a year.',
      'Built Airflow pipelines delivering securities-lending market data to stakeholders, meeting every SLA.',
    ],
  },
];

export const SKILLS = [
  ['Languages', 'Python, SQL, PySpark, Java, JavaScript/TypeScript'],
  ['Data Engineering', 'Spark, Structured Streaming, Databricks, Delta Lake, Kafka, Redpanda, Debezium, Airflow, Azure Data Factory, Medallion architecture'],
  ['Graph & Semantic', 'Stardog, ontology modeling, USDM, graph data modeling, MCP servers'],
  ['Databases', 'PostgreSQL, PostGIS, pgvector, Azure Data Lake'],
  ['Cloud & Ops', 'Azure, GCP Cloud Run, FastAPI, GitHub, Datadog'],
  ['AI / Agentic', 'LangGraph, LangChain, Azure OpenAI, vector search, Databricks Genie, agentic memory'],
];

export const HONORS = [
  'Databricks Certified Data Engineer Associate',
  'Star Performer Award and AI Champion recognition',
  'Winner, StoneX Enterprise AI Hackathon — AI-assisted trade matching and email sentiment analysis',
  'B.E. Computer Science Engineering — CMR Institute of Technology, Bangalore, 2023',
];
