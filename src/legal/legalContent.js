/**
 * In-app legal copy for Jain Sansaar. Update `lastUpdated` and `supportEmail` when you change this file.
 * For Google Play: host the HTML mirrors under legal-hosting/ on a public URL and enter that URL in Play Console.
 */

export const LEGAL_META = {
  appName: 'Jain Sansaar',
  operatorLabel: 'the operator of Jain Sansaar',
  lastUpdated: 'March 22, 2025',
  supportEmail: 'admin@jainsansaar.com',
  governingLaw: 'India',
};

const {appName, operatorLabel, lastUpdated, supportEmail, governingLaw} =
  LEGAL_META;

export const LEGAL_DOCUMENTS = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated,
    intro: [
      `This Privacy Policy describes how ${operatorLabel} ('we', 'us', or 'our') collects, uses, stores, and shares information when you use the ${appName} mobile application (the 'App'). By using the App, you agree to this Privacy Policy.`,
      `If you do not agree, please do not use the App. For questions, contact us at ${supportEmail}.`,
    ],
    sections: [
      {
        heading: '1. Information we collect',
        paragraphs: [
          '1.1 Account and profile information. When you register or sign in, we process information you provide such as name, username, email address, phone number, date of birth (if requested), and password (transmitted securely to our servers; we do not store your password in plain text).',
          '1.2 Content you submit. The App may allow you to upload or post photos, videos, text, feedback, or other materials (User Content). User Content is processed to provide the features you choose (for example, community posts, reels, stories, or profile images).',
          '1.3 Location information. If you enable location permissions, we collect approximate or precise device location to show nearby temples, maps, or related features. You can disable location in your device settings; some features may not work without it.',
          '1.4 Device and technical data. We automatically receive certain technical information when you use the App, such as device type, operating system, app version, language preference, IP address, and diagnostic or log data needed to operate and secure the service.',
          '1.5 Local storage on your device. The App uses on-device storage (for example, Async Storage and similar mechanisms) to keep you signed in, cache preferences, store authentication tokens, remember recent searches where applicable, and improve performance. If you use Remember me or similar options, your login identifier and password may be stored on your device; anyone with access to your device may be able to use your account.',
          '1.6 Communications. If you contact support or send feedback through the App or linked forms, we collect the information you provide in those messages.',
        ],
      },
      {
        heading: '2. How we use information',
        paragraphs: [
          'We use the information above to: provide, maintain, and improve the App; authenticate users and secure accounts; personalize content and language; show maps and location-based temple information when you opt in; process uploads and community features; respond to support requests; comply with law; and detect, prevent, and address fraud, abuse, or technical issues.',
        ],
      },
      {
        heading: '3. Legal bases (where applicable)',
        paragraphs: [
          'Where required by law, we rely on appropriate legal bases such as: performance of a contract (providing the App you requested); legitimate interests (security, analytics, product improvement), balanced against your rights; consent (for example, optional permissions or marketing where applicable); and legal obligation.',
        ],
      },
      {
        heading: '4. Sharing of information',
        paragraphs: [
          '4.1 Service providers. We may share information with vendors and hosting providers that assist us with infrastructure, authentication, email, analytics, or customer support, subject to confidentiality and data-processing terms.',
          '4.2 Maps and third-party services. The App may use mapping services (such as Google Maps) to display locations. Those providers process data under their own policies when you use map features.',
          '4.3 Legal and safety. We may disclose information if required by law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of users, us, or others.',
          '4.4 Business transfers. If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.',
          'We do not sell your personal information to third parties in the traditional sense of selling data for money.',
        ],
      },
      {
        heading: '5. Real-time features',
        paragraphs: [
          'If the App uses WebSockets, push notifications, or similar technologies for chat, notifications, or live updates, related data is processed to deliver those features and maintain connection quality.',
        ],
      },
      {
        heading: '6. Data retention',
        paragraphs: [
          'We retain information for as long as your account is active or as needed to provide the App, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account subject to applicable law and legitimate retention needs.',
        ],
      },
      {
        heading: '7. Security',
        paragraphs: [
          'We implement reasonable administrative, technical, and organizational measures to protect your information. No method of transmission or storage is 100% secure; we cannot guarantee absolute security.',
        ],
      },
      {
        heading: '8. Your choices and rights',
        paragraphs: [
          'You may update certain profile information in the App, adjust device permissions (camera, photos, location, notifications), or sign out to limit use of local tokens. Depending on your jurisdiction, you may have rights to access, correct, delete, or export personal data, or to object to or restrict certain processing. Contact us at the email below to exercise these rights where applicable.',
        ],
      },
      {
        heading: '9. Children',
        paragraphs: [
          'The App is not directed at children under 13 (or the minimum age required in your country). We do not knowingly collect personal information from children. If you believe a child has provided us personal information, contact us and we will take appropriate steps to delete it.',
        ],
      },
      {
        heading: '10. International transfers',
        paragraphs: [
          'Your information may be processed in countries where we or our service providers operate. Where required, we use appropriate safeguards for cross-border transfers.',
        ],
      },
      {
        heading: '11. Changes to this policy',
        paragraphs: [
          'We may update this Privacy Policy from time to time. We will post the updated version in the App and revise the Last updated date. Continued use after changes constitutes acceptance unless applicable law requires additional consent.',
        ],
      },
      {
        heading: '12. Contact',
        paragraphs: [
          `Questions about this Privacy Policy: ${supportEmail}.`,
          `Last updated: ${lastUpdated}.`,
        ],
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    lastUpdated,
    intro: [
      `These Terms & Conditions ('Terms') govern your access to and use of the ${appName} mobile application (the 'App') provided by ${operatorLabel}. By creating an account, accessing, or using the App, you agree to these Terms.`,
      'If you do not agree, do not use the App.',
    ],
    sections: [
      {
        heading: '1. Eligibility',
        paragraphs: [
          'You must be legally able to enter a binding contract in your jurisdiction and meet any minimum age required by law to use the App. If you use the App on behalf of an organization, you represent that you have authority to bind that organization.',
        ],
      },
      {
        heading: '2. Account registration and security',
        paragraphs: [
          'You agree to provide accurate registration information and to keep it updated. You are responsible for safeguarding your password and for all activity under your account. Notify us promptly at the contact email if you suspect unauthorized access.',
        ],
      },
      {
        heading: '3. License to use the App',
        paragraphs: [
          'Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to install and use the App for personal, non-commercial purposes, unless we agree otherwise in writing.',
        ],
      },
      {
        heading: '4. User content and conduct',
        paragraphs: [
          '4.1 You retain ownership of content you submit, but you grant us a worldwide, non-exclusive, royalty-free license to host, store, reproduce, modify, display, and distribute your User Content solely to operate, promote, and improve the App and related services.',
          '4.2 You agree not to: violate any law; infringe intellectual property or privacy rights; upload malware or attempt to disrupt the App; harass, abuse, or harm others; post obscene, hateful, or violent content; impersonate others; scrape or automate access in a way that burdens our systems; or circumvent security or usage limits.',
          'We may remove content or suspend accounts that violate these Terms or that we reasonably believe pose risk to users or the service.',
        ],
      },
      {
        heading: '5. Religious and informational content',
        paragraphs: [
          `${appName} may include devotional, educational, or community content related to Jain heritage, temples, and culture. Such content is provided for general information and community engagement. It is not professional religious, legal, medical, or financial advice. You should consult qualified professionals where appropriate.`,
        ],
      },
      {
        heading: '6. Third-party services',
        paragraphs: [
          'The App may link to or embed third-party websites, maps, video players, or payment or feedback tools. Those services are governed by their own terms and privacy policies. We are not responsible for third-party content or practices.',
        ],
      },
      {
        heading: '7. Intellectual property',
        paragraphs: [
          'The App, its branding, logos, and software are owned by us or our licensors. Except for the limited license above, no rights are granted to you. Do not copy, modify, distribute, or reverse engineer the App except as permitted by applicable law.',
        ],
      },
      {
        heading: '8. Disclaimers',
        paragraphs: [
          'THE APP IS PROVIDED AS IS AND AS AVAILABLE WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.',
        ],
      },
      {
        heading: '9. Limitation of liability',
        paragraphs: [
          'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE AND OUR AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING FROM YOUR USE OF THE APP. OUR TOTAL LIABILITY FOR CLAIMS ARISING OUT OF OR RELATED TO THE APP OR THESE TERMS IS LIMITED TO THE GREATER OF (A) THE AMOUNT YOU PAID US FOR THE APP IN THE TWELVE MONTHS BEFORE THE CLAIM OR (B) ONE HUNDRED INDIAN RUPEES (INR 100), IF YOU HAVE NOT PAID US ANYTHING. SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; IN THOSE CASES, OUR LIABILITY IS LIMITED TO THE FULLEST EXTENT PERMITTED BY LAW.',
        ],
      },
      {
        heading: '10. Indemnity',
        paragraphs: [
          'You agree to indemnify and hold harmless us and our affiliates from claims, damages, losses, and expenses (including reasonable legal fees) arising out of your User Content, your use of the App, or your violation of these Terms or applicable law, to the extent permitted by law.',
        ],
      },
      {
        heading: '11. Suspension and termination',
        paragraphs: [
          'We may suspend or terminate your access to the App at any time, with or without notice, for conduct that we believe violates these Terms or harms the service or others. You may stop using the App at any time. Provisions that by their nature should survive will survive termination.',
        ],
      },
      {
        heading: '12. Changes to the Terms',
        paragraphs: [
          'We may modify these Terms by posting an updated version in the App. The “Last updated” date will change. Your continued use after the effective date constitutes acceptance of the revised Terms where permitted by law.',
        ],
      },
      {
        heading: '13. Governing law and disputes',
        paragraphs: [
          `These Terms are governed by the laws of ${governingLaw}, without regard to conflict-of-law principles, except where mandatory consumer protection laws of your country require otherwise. Courts located in ${governingLaw} shall have exclusive jurisdiction, subject to any non-waivable rights you may have under local law.`,
        ],
      },
      {
        heading: '14. Contact',
        paragraphs: [
          `For questions about these Terms: ${supportEmail}.`,
          `Last updated: ${lastUpdated}.`,
        ],
      },
    ],
  },
};
