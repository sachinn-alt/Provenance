import { GeneratedSchema, ExtractedRecord, PromptPreset } from '@/types';

export const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'ai-startups',
    title: 'Top AI Agents Startups',
    category: 'Venture Capital',
    prompt: 'Collect top 10 early-stage AI agent startups with founders, funding amount, headquarters, core tech stack, and careers link.',
    description: 'Autonomous agents, workflow orchestrators, and reasoning systems.'
  },
  {
    id: 'remote-ai-jobs',
    title: 'Remote AI Engineer Roles',
    category: 'Talent Sourcing',
    prompt: 'Find 10 high-paying remote AI/ML engineering roles with company, salary range, required experience, primary stack, and application link.',
    description: 'LLM infrastructure, agent architecture, and ML engineering jobs.'
  },
  {
    id: 'mech-keyboards',
    title: 'Mechanical Keyboard Switches',
    category: 'E-Commerce / Hardware',
    prompt: 'Collect top 8 mechanical keyboard switches with switch type, actuation force, travel distance, sound profile, and price per 10-pack.',
    description: 'Linear, tactile, and clicky switches from leading manufacturers.'
  },
  {
    id: 'saas-pricing',
    title: 'Developer SaaS Pricing Tiers',
    category: 'Market Intelligence',
    prompt: 'Extract pricing tiers and developer quotas for top AI API platforms with starter price, monthly free tier limit, and overage rates.',
    description: 'Compare developer platform unit economics and monetization models.'
  }
];

export const PRESET_DATASETS: Record<string, { schema: GeneratedSchema; records: ExtractedRecord[] }> = {
  'ai-startups': {
    schema: {
      entityName: 'AIAgentStartup',
      description: 'Seed and Series A AI agent startups developing autonomous workflow systems',
      primaryKeys: ['companyName', 'website'],
      attributes: [
        { name: 'companyName', type: 'string', description: 'Name of the startup', required: true, example: 'Cognition' },
        { name: 'founders', type: 'string', description: 'Founders / executive team', required: true, example: 'Scott Wu, Walden Yan' },
        { name: 'fundingStage', type: 'badge', description: 'Current funding round & total raised', required: true, example: 'Series A ($175M)' },
        { name: 'headquarters', type: 'string', description: 'Primary HQ location', required: false, example: 'San Francisco, CA' },
        { name: 'techFocus', type: 'string', description: 'Core product description and domain', required: true, example: 'Autonomous software engineer (Devin)' },
        { name: 'careersUrl', type: 'url', description: 'Official careers or open roles portal', required: true, example: 'https://cognition.ai/careers' }
      ],
      searchStrategy: {
        suggestedQueries: [
          'top AI agent startups funding 2025 2026',
          'series A autonomous AI agents Y Combinator TechCrunch',
          'site:techcrunch.com "ai agents" founders funding'
        ],
        targetDomainHints: ['techcrunch.com', 'ycombinator.com', 'dealroom.co', 'venturebeat.com']
      }
    },
    records: [
      {
        id: 'rec-001',
        entityName: 'AIAgentStartup',
        data: {
          companyName: 'Cognition AI',
          founders: 'Scott Wu (CEO), Walden Yan, Steven Hao',
          fundingStage: 'Series A ($175M)',
          headquarters: 'San Francisco, CA',
          techFocus: 'Autonomous software engineering agent (Devin) with long-horizon reasoning',
          careersUrl: 'https://cognition.ai/careers'
        },
        provenance: {
          companyName: {
            value: 'Cognition AI',
            sourceUrl: 'https://techcrunch.com/2024/04/24/cognition-funding-valuation',
            sourceDomain: 'techcrunch.com',
            exactQuote: 'Cognition AI, the startup behind the autonomous coding assistant Devin, raised $175 million in a round led by Founders Fund.',
            confidence: 0.99,
            extractedAt: '2026-09-27T18:40:12Z'
          },
          founders: {
            value: 'Scott Wu (CEO), Walden Yan, Steven Hao',
            sourceUrl: 'https://cognition.ai/about',
            sourceDomain: 'cognition.ai',
            exactQuote: 'Founded in 2023 by competitive programming gold medalists Scott Wu, Walden Yan, and Steven Hao.',
            confidence: 0.98,
            extractedAt: '2026-09-27T18:40:14Z'
          },
          fundingStage: {
            value: 'Series A ($175M)',
            sourceUrl: 'https://techcrunch.com/2024/04/24/cognition-funding-valuation',
            sourceDomain: 'techcrunch.com',
            exactQuote: 'The round valued Cognition at $2 billion within six months of founding.',
            confidence: 0.97,
            extractedAt: '2026-09-27T18:40:15Z'
          },
          careersUrl: {
            value: 'https://cognition.ai/careers',
            sourceUrl: 'https://cognition.ai',
            sourceDomain: 'cognition.ai',
            exactQuote: 'Join our team building the future of software engineering at cognition.ai/careers.',
            confidence: 1.0,
            extractedAt: '2026-09-27T18:40:16Z'
          }
        },
        validationScore: 100,
        isDuplicate: false,
        mergedSources: ['https://techcrunch.com/2024/04/24/cognition-funding-valuation', 'https://cognition.ai/about']
      },
      {
        id: 'rec-002',
        entityName: 'AIAgentStartup',
        data: {
          companyName: 'Factory AI',
          founders: 'Matan Grinberg, Eno Reyes',
          fundingStage: 'Series A ($15M)',
          headquarters: 'San Francisco, CA',
          techFocus: 'Enterprise autonomous software Droids for automated refactoring and testing',
          careersUrl: 'https://factory.ai/careers'
        },
        provenance: {
          companyName: {
            value: 'Factory AI',
            sourceUrl: 'https://venturebeat.com/ai/factory-series-a-funding-code-droids',
            sourceDomain: 'venturebeat.com',
            exactQuote: 'Factory announced $15 million in Series A funding led by Sequoia Capital to bring Droids to software lifecycle.',
            confidence: 0.96,
            extractedAt: '2026-09-27T18:40:22Z'
          },
          founders: {
            value: 'Matan Grinberg, Eno Reyes',
            sourceUrl: 'https://venturebeat.com/ai/factory-series-a-funding-code-droids',
            sourceDomain: 'venturebeat.com',
            exactQuote: 'Founded by Stanford alumni Matan Grinberg and Eno Reyes.',
            confidence: 0.95,
            extractedAt: '2026-09-27T18:40:23Z'
          },
          fundingStage: {
            value: 'Series A ($15M)',
            sourceUrl: 'https://venturebeat.com/ai/factory-series-a-funding-code-droids',
            sourceDomain: 'venturebeat.com',
            exactQuote: 'The $15 million funding round was backed by Sequoia Capital and Lux Capital.',
            confidence: 0.98,
            extractedAt: '2026-09-27T18:40:24Z'
          },
          careersUrl: {
            value: 'https://factory.ai/careers',
            sourceUrl: 'https://factory.ai',
            sourceDomain: 'factory.ai',
            exactQuote: 'We are hiring across engineering and research: factory.ai/careers.',
            confidence: 0.99,
            extractedAt: '2026-09-27T18:40:25Z'
          }
        },
        validationScore: 98,
        isDuplicate: false,
        mergedSources: ['https://venturebeat.com/ai/factory-series-a-funding-code-droids']
      },
      {
        id: 'rec-003',
        entityName: 'AIAgentStartup',
        data: {
          companyName: 'Lindy.ai',
          founders: 'Flo Crivello',
          fundingStage: 'Series A ($50M)',
          headquarters: 'San Francisco, CA',
          techFocus: 'No-code workplace agent builder across sales, medical triage, and recruiting',
          careersUrl: 'https://lindy.ai/careers'
        },
        provenance: {
          companyName: {
            value: 'Lindy.ai',
            sourceUrl: 'https://news.ycombinator.com/item?id=38290124',
            sourceDomain: 'news.ycombinator.com',
            exactQuote: 'Lindy AI launches personalized autonomous workplace assistant agents.',
            confidence: 0.94,
            extractedAt: '2026-09-27T18:40:31Z'
          },
          founders: {
            value: 'Flo Crivello',
            sourceUrl: 'https://www.forbes.com/sites/kenrickcai/lindy-ai-agents',
            sourceDomain: 'forbes.com',
            exactQuote: 'Founded by former Uber product manager Flo Crivello.',
            confidence: 0.97,
            extractedAt: '2026-09-27T18:40:32Z'
          },
          fundingStage: {
            value: 'Series A ($50M)',
            sourceUrl: 'https://www.forbes.com/sites/kenrickcai/lindy-ai-agents',
            sourceDomain: 'forbes.com',
            exactQuote: 'Lindy raised $50 million in Series A funding to scale multi-agent orchestration.',
            confidence: 0.93,
            extractedAt: '2026-09-27T18:40:33Z'
          },
          careersUrl: {
            value: 'https://lindy.ai/careers',
            sourceUrl: 'https://lindy.ai',
            sourceDomain: 'lindy.ai',
            exactQuote: 'See open engineering roles at lindy.ai/careers.',
            confidence: 0.99,
            extractedAt: '2026-09-27T18:40:34Z'
          }
        },
        validationScore: 96,
        isDuplicate: false,
        mergedSources: ['https://news.ycombinator.com/item?id=38290124', 'https://www.forbes.com/sites/kenrickcai/lindy-ai-agents']
      },
      {
        id: 'rec-004',
        entityName: 'AIAgentStartup',
        data: {
          companyName: 'Decagon AI',
          founders: 'Jesse Zhang, Ashwin Sreenivas',
          fundingStage: 'Series B ($65M)',
          headquarters: 'San Francisco, CA',
          techFocus: 'Enterprise autonomous customer service agents with enterprise CRM integration',
          careersUrl: 'https://decagon.ai/careers'
        },
        provenance: {
          companyName: {
            value: 'Decagon AI',
            sourceUrl: 'https://techcrunch.com/2024/10/15/decagon-raises-65m-bain-capital-accel',
            sourceDomain: 'techcrunch.com',
            exactQuote: 'Decagon AI, which deploys conversational enterprise agents, secured $65 million in funding.',
            confidence: 0.99,
            extractedAt: '2026-09-27T18:40:40Z'
          },
          founders: {
            value: 'Jesse Zhang, Ashwin Sreenivas',
            sourceUrl: 'https://techcrunch.com/2024/10/15/decagon-raises-65m-bain-capital-accel',
            sourceDomain: 'techcrunch.com',
            exactQuote: 'Co-founders Jesse Zhang and Ashwin Sreenivas previously built companies acquired by Twitter and Helia.',
            confidence: 0.98,
            extractedAt: '2026-09-27T18:40:41Z'
          },
          fundingStage: {
            value: 'Series B ($65M)',
            sourceUrl: 'https://techcrunch.com/2024/10/15/decagon-raises-65m-bain-capital-accel',
            sourceDomain: 'techcrunch.com',
            exactQuote: 'The Series B was co-led by Bain Capital Ventures and Accel.',
            confidence: 0.99,
            extractedAt: '2026-09-27T18:40:42Z'
          },
          careersUrl: {
            value: 'https://decagon.ai/careers',
            sourceUrl: 'https://decagon.ai',
            sourceDomain: 'decagon.ai',
            exactQuote: 'Explore roles: decagon.ai/careers.',
            confidence: 1.0,
            extractedAt: '2026-09-27T18:40:43Z'
          }
        },
        validationScore: 100,
        isDuplicate: false,
        mergedSources: ['https://techcrunch.com/2024/10/15/decagon-raises-65m-bain-capital-accel']
      },
      {
        id: 'rec-005',
        entityName: 'AIAgentStartup',
        data: {
          companyName: 'Sierra AI',
          founders: 'Bret Taylor, Clay Bavor',
          fundingStage: 'Series B ($175M)',
          headquarters: 'San Francisco, CA',
          techFocus: 'Enterprise customer experience conversational agents with zero hallucination guarantee',
          careersUrl: 'https://sierra.ai/careers'
        },
        provenance: {
          companyName: {
            value: 'Sierra AI',
            sourceUrl: 'https://bloomberg.com/news/articles/2024-10-28/bret-taylor-ai-startup-sierra-valuation-4-5-billion',
            sourceDomain: 'bloomberg.com',
            exactQuote: 'Bret Taylor’s AI startup Sierra closed a $175 million funding round valued at $4.5 billion.',
            confidence: 0.98,
            extractedAt: '2026-09-27T18:40:48Z'
          },
          founders: {
            value: 'Bret Taylor, Clay Bavor',
            sourceUrl: 'https://sierra.ai/about',
            sourceDomain: 'sierra.ai',
            exactQuote: 'Sierra was founded in 2023 by former Salesforce co-CEO Bret Taylor and former Google VP Clay Bavor.',
            confidence: 0.99,
            extractedAt: '2026-09-27T18:40:49Z'
          },
          fundingStage: {
            value: 'Series B ($175M)',
            sourceUrl: 'https://bloomberg.com/news/articles/2024-10-28/bret-taylor-ai-startup-sierra-valuation-4-5-billion',
            sourceDomain: 'bloomberg.com',
            exactQuote: 'The $175 million investment was led by Greenoaks Capital.',
            confidence: 0.97,
            extractedAt: '2026-09-27T18:40:50Z'
          },
          careersUrl: {
            value: 'https://sierra.ai/careers',
            sourceUrl: 'https://sierra.ai',
            sourceDomain: 'sierra.ai',
            exactQuote: 'We are expanding our core AI research team at sierra.ai/careers.',
            confidence: 1.0,
            extractedAt: '2026-09-27T18:40:51Z'
          }
        },
        validationScore: 100,
        isDuplicate: false,
        mergedSources: ['https://bloomberg.com/news/articles/2024-10-28/bret-taylor-ai-startup-sierra-valuation-4-5-billion', 'https://sierra.ai/about']
      },
      {
        id: 'rec-006',
        entityName: 'AIAgentStartup',
        data: {
          companyName: 'Devin Technologies (Duplicate candidate)',
          founders: 'Scott Wu',
          fundingStage: 'Series A ($175M)',
          headquarters: 'San Francisco, CA',
          techFocus: 'Devin autonomous coding engineer',
          careersUrl: 'https://cognition.ai/careers'
        },
        provenance: {
          companyName: {
            value: 'Devin Technologies',
            sourceUrl: 'https://x.com/cognition_labs/status/1767548763134964000',
            sourceDomain: 'x.com',
            exactQuote: 'Introducing Devin, the first AI software engineer.',
            confidence: 0.91,
            extractedAt: '2026-09-27T18:40:55Z'
          }
        },
        validationScore: 84,
        isDuplicate: true,
        duplicateOf: 'rec-001',
        mergedSources: ['https://x.com/cognition_labs/status/1767548763134964000']
      }
    ]
  },
  'remote-ai-jobs': {
    schema: {
      entityName: 'RemoteAIJob',
      description: 'Senior remote AI, ML infrastructure, and agent engineering roles',
      primaryKeys: ['jobTitle', 'company'],
      attributes: [
        { name: 'jobTitle', type: 'string', description: 'Position title', required: true, example: 'Senior AI Platform Engineer' },
        { name: 'company', type: 'string', description: 'Hiring company', required: true, example: 'Anthropic' },
        { name: 'salaryRange', type: 'currency', description: 'Annual base compensation range', required: true, example: '$210,000 - $285,000' },
        { name: 'workplaceType', type: 'badge', description: 'Remote / Hybrid flexibility', required: true, example: 'Remote (US/EU)' },
        { name: 'experienceRequired', type: 'string', description: 'Experience level & key technologies', required: true, example: '5+ years, PyTorch, Ray, vLLM' },
        { name: 'applyUrl', type: 'url', description: 'Direct application link', required: true, example: 'https://jobs.lever.co/anthropic/ai-platform' }
      ],
      searchStrategy: {
        suggestedQueries: [
          'remote senior AI agent engineer jobs "salary"',
          'site:jobs.ashbyhq.com AI engineer remote salary',
          'site:lever.co "AI platform engineer" remote'
        ],
        targetDomainHints: ['ashbyhq.com', 'lever.co', 'greenhouse.io', 'remoteok.com']
      }
    },
    records: [
      {
        id: 'job-001',
        entityName: 'RemoteAIJob',
        data: {
          jobTitle: 'Staff ML Infrastructure Engineer',
          company: 'Mistral AI',
          salaryRange: '€140,000 - €210,000',
          workplaceType: 'Remote (Europe)',
          experienceRequired: '6+ years in distributed training, Triton, Slurm, InfiniBand',
          applyUrl: 'https://jobs.lever.co/mistral/infra-staff'
        },
        provenance: {
          jobTitle: {
            value: 'Staff ML Infrastructure Engineer',
            sourceUrl: 'https://jobs.lever.co/mistral/infra-staff',
            sourceDomain: 'lever.co',
            exactQuote: 'Mistral AI is looking for a Staff ML Infrastructure Engineer to scale our multi-thousand GPU clusters.',
            confidence: 0.99,
            extractedAt: '2026-09-27T18:41:00Z'
          },
          salaryRange: {
            value: '€140,000 - €210,000',
            sourceUrl: 'https://jobs.lever.co/mistral/infra-staff',
            sourceDomain: 'lever.co',
            exactQuote: 'Base compensation bracket: €140,000 - €210,000 gross per annum plus equity package.',
            confidence: 0.98,
            extractedAt: '2026-09-27T18:41:01Z'
          },
          applyUrl: {
            value: 'https://jobs.lever.co/mistral/infra-staff',
            sourceUrl: 'https://jobs.lever.co/mistral/infra-staff',
            sourceDomain: 'lever.co',
            exactQuote: 'Apply directly via Lever submission portal.',
            confidence: 1.0,
            extractedAt: '2026-09-27T18:41:02Z'
          }
        },
        validationScore: 100,
        isDuplicate: false,
        mergedSources: ['https://jobs.lever.co/mistral/infra-staff']
      },
      {
        id: 'job-002',
        entityName: 'RemoteAIJob',
        data: {
          jobTitle: 'Senior Agentic Workflow Engineer',
          company: 'Cursor (Anysphere)',
          salaryRange: '$190,000 - $260,000',
          workplaceType: 'Remote (Worldwide)',
          experienceRequired: '4+ years, TypeScript, Tree-sitter, LLM context caching',
          applyUrl: 'https://anysphere.inc/careers/agentic-eng'
        },
        provenance: {
          jobTitle: {
            value: 'Senior Agentic Workflow Engineer',
            sourceUrl: 'https://anysphere.inc/careers/agentic-eng',
            sourceDomain: 'anysphere.inc',
            exactQuote: 'We are hiring a Senior Agentic Workflow Engineer to build next-generation background agent loops in Cursor.',
            confidence: 0.99,
            extractedAt: '2026-09-27T18:41:10Z'
          },
          salaryRange: {
            value: '$190,000 - $260,000',
            sourceUrl: 'https://anysphere.inc/careers/agentic-eng',
            sourceDomain: 'anysphere.inc',
            exactQuote: 'Target cash compensation is $190k - $260k + meaningful founding equity grants.',
            confidence: 0.97,
            extractedAt: '2026-09-27T18:41:11Z'
          },
          applyUrl: {
            value: 'https://anysphere.inc/careers/agentic-eng',
            sourceUrl: 'https://anysphere.inc/careers',
            sourceDomain: 'anysphere.inc',
            exactQuote: 'Direct application link: anysphere.inc/careers/agentic-eng.',
            confidence: 1.0,
            extractedAt: '2026-09-27T18:41:12Z'
          }
        },
        validationScore: 100,
        isDuplicate: false,
        mergedSources: ['https://anysphere.inc/careers/agentic-eng']
      }
    ]
  },
  'mech-keyboards': {
    schema: {
      entityName: 'KeyboardSwitch',
      description: 'Mechanical keyboard switches with actuation metrics and sound profiles',
      primaryKeys: ['switchName', 'manufacturer'],
      attributes: [
        { name: 'switchName', type: 'string', description: 'Brand and model name', required: true, example: 'Gateron Oil King' },
        { name: 'manufacturer', type: 'string', description: 'Manufacturer company', required: true, example: 'Gateron' },
        { name: 'switchType', type: 'badge', description: 'Linear, Tactile, or Clicky', required: true, example: 'Linear' },
        { name: 'actuationForce', type: 'number', description: 'Operating force in grams (gf)', required: true, example: '55' },
        { name: 'soundProfile', type: 'string', description: 'Acoustic character (Thocky, Clacky, Silent)', required: false, example: 'Deep Thocky' },
        { name: 'pricePer10', type: 'currency', description: 'Retail price for a pack of 10 switches', required: true, example: '$6.80' }
      ],
      searchStrategy: {
        suggestedQueries: [
          'top mechanical keyboard switches 2025 actuation force sound profile',
          'gateron boba u4t vertex v1 switch specifications',
          'mechanical keyboard switches price per pack comparison'
        ],
        targetDomainHints: ['theremingoat.com', 'mechanicalkeyboards.com', 'keebsforall.com']
      }
    },
    records: [
      {
        id: 'sw-001',
        entityName: 'KeyboardSwitch',
        data: {
          switchName: 'Gateron Oil King',
          manufacturer: 'Gateron',
          switchType: 'Linear',
          actuationForce: 55,
          soundProfile: 'Deep, Marbly Thock',
          pricePer10: '$6.50'
        },
        provenance: {
          switchName: {
            value: 'Gateron Oil King',
            sourceUrl: 'https://theremingoat.com/blog/gateron-oil-king-switch-review',
            sourceDomain: 'theremingoat.com',
            exactQuote: 'The Gateron Oil King features an all-black nylon upper and proprietary INK bottom housing.',
            confidence: 0.99,
            extractedAt: '2026-09-27T18:42:01Z'
          },
          actuationForce: {
            value: 55,
            sourceUrl: 'https://theremingoat.com/blog/gateron-oil-king-switch-review',
            sourceDomain: 'theremingoat.com',
            exactQuote: 'Operating actuation force measures at 55 ± 5 gf with a 4.0mm total travel.',
            confidence: 0.98,
            extractedAt: '2026-09-27T18:42:02Z'
          },
          pricePer10: {
            value: '$6.50',
            sourceUrl: 'https://keebsforall.com/products/gateron-oil-king-switches',
            sourceDomain: 'keebsforall.com',
            exactQuote: '$6.50 USD per 10 switches ($0.65/switch).',
            confidence: 0.97,
            extractedAt: '2026-09-27T18:42:03Z'
          }
        },
        validationScore: 100,
        isDuplicate: false,
        mergedSources: ['https://theremingoat.com/blog/gateron-oil-king-switch-review', 'https://keebsforall.com/products/gateron-oil-king-switches']
      },
      {
        id: 'sw-002',
        entityName: 'KeyboardSwitch',
        data: {
          switchName: 'Gazzew Boba U4T',
          manufacturer: 'Gazzew (Outemu)',
          switchType: 'Tactile',
          actuationForce: 62,
          soundProfile: 'Crisp Tactile Pop (Thock)',
          pricePer10: '$7.20'
        },
        provenance: {
          switchName: {
            value: 'Gazzew Boba U4T',
            sourceUrl: 'https://theremingoat.com/blog/boba-u4t-switch-review',
            sourceDomain: 'theremingoat.com',
            exactQuote: 'The Boba U4T is renowned as the standard for rounded, D-bump tactile mechanical switches.',
            confidence: 0.99,
            extractedAt: '2026-09-27T18:42:10Z'
          },
          actuationForce: {
            value: 62,
            sourceUrl: 'https://theremingoat.com/blog/boba-u4t-switch-review',
            sourceDomain: 'theremingoat.com',
            exactQuote: 'Offered in 62g and 68g bottom-out weights with high actuation tactile bump.',
            confidence: 0.98,
            extractedAt: '2026-09-27T18:42:11Z'
          },
          pricePer10: {
            value: '$7.20',
            sourceUrl: 'https://mkultra.click/gazzew-boba-u4t',
            sourceDomain: 'mkultra.click',
            exactQuote: 'Pack of 10 switches retail at $7.20.',
            confidence: 0.96,
            extractedAt: '2026-09-27T18:42:12Z'
          }
        },
        validationScore: 100,
        isDuplicate: false,
        mergedSources: ['https://theremingoat.com/blog/boba-u4t-switch-review']
      }
    ]
  }
};
