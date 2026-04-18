// Sample data for Rx2Realty

window.R2R_DATA = {
  exam: {
    name: 'Texas Real Estate Salesperson Exam',
    date: new Date('2026-07-27T09:00:00'),
    startedStudying: new Date('2026-04-09'),
    hoursCompleted: 20,
    hoursRequired: 180,
    practiceAvg: 82,
    streak: 4,
  },

  topics: [
    { name: 'Principles of Real Estate I', pct: 30 },
    { name: 'Principles of Real Estate II', pct: 0 },
    { name: 'Law of Agency', pct: 0 },
    { name: 'Law of Contracts', pct: 0 },
    { name: 'Promulgated Contract Forms', pct: 0 },
    { name: 'Real Estate Finance', pct: 0 },
    { name: 'Sales Agent License Practice Exams', pct: 0 },
    { name: 'Texas Sales Agent License Exam Preparation', pct: 0 },
  ],

  recentSessions: [4, 6, 5, 7, 3, 8, 6, 7, 9, 5, 6, 8, 4, 7],

  posts: [
    {
      id: 'p1',
      title: 'Why a compounding pharmacist is studying real estate',
      excerpt: 'Years of formulating personalized therapies taught me that value gets built in the details — the same instinct that shows up in a well-run deal. Here\'s how the two worlds rhyme.',
      category: 'Journal',
      date: 'Apr 14, 2026',
      readTime: '7 min',
      thumb: 'sage',
      feature: true,
      tags: ['journey', 'career pivot'],
    },
    {
      id: 'p3',
      title: 'Five soft skills pharmacists already have',
      excerpt: 'If you can walk a patient through a compounded therapy, you\'re already doing 60% of what a listing agent does. Here\'s the translation.',
      category: 'Bridge',
      date: 'Apr 6, 2026',
      readTime: '5 min',
      thumb: 'plain',
      tags: ['real estate', 'crossover'],
    },
  ],

  qa: [
    {
      q: 'How do you keep pharmacy work from leaking into your study time?',
      a: 'Short answer: I don\'t study on heavy lab or partnership days. Long answer: I protect my two "good brain" mornings per week, put my phone in another room, and do focused 90-minute blocks with a timer. The rest of the week I watch videos passively. Treat your attention like a controlled substance — measure doses carefully.',
      asker: 'maya.k',
      topic: 'study',
      likes: 34,
      answers: 6,
    },
    {
      q: 'Can I legally mention my PharmD on my real estate marketing materials?',
      a: 'Texas rules let you list credentials that are current and accurate, but the TREC Canons of Professional Ethics mean you have to be careful not to imply expertise you don\'t have. I checked with my sponsoring broker and we decided to lead with "pharmacist-turned-agent" as a personal story in my bio, not as a selling feature on listings.',
      asker: 'derek.p',
      topic: 'licensing',
      likes: 22,
      answers: 4,
    },
    {
      q: 'Which pharmacy skill translated BEST to real estate?',
      a: 'Patient counseling. Every buyer consult is a medication counseling session in disguise — you\'re walking someone through a high-stakes decision, explaining side effects they didn\'t ask about, and trying to spot the thing they\'re not telling you. If you can consult on a compounded hormone therapy, you can handle a first-time buyer\'s jitters.',
      asker: 'jenn.rx',
      topic: 'bridge',
      likes: 51,
      answers: 11,
    },
    {
      q: 'Do I need to drop to part-time pharmacy to make this work?',
      a: 'I didn\'t. I protect mornings for deep work and keep partnership calls and lab time structured so real estate can fit around them. Sponsoring brokers are used to new agents with day jobs — ask about their track record supporting people who can\'t answer the phone 9-to-5.',
      asker: 'priya.h',
      topic: 'career',
      likes: 19,
      answers: 3,
    },
  ],
};
