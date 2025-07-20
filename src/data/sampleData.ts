// Sample data for Digital Skills Coach prototype
import { LearningModule, LocalResource } from '../types';

export const sampleLearningModules: LearningModule[] = [
  {
    id: 'basic-phone-setup',
    title: 'Getting Started with Your Mobile Phone',
    description: 'Learn the basics of using a mobile phone (a phone you can carry around), from turning it on to making your first call.',
    difficulty: 'beginner',
    category: 'basic-skills',
    estimatedTime: 15,
    steps: [
      {
        id: 'step-1',
        title: 'Turning on your phone',
        content: 'Look for the power button on the side of your phone. It\'s usually a long, thin button. Press and hold it for 3 seconds until you see the screen light up.',
        type: 'instruction',
        media: {
          type: 'image',
          url: '/placeholder.svg',
          alt: 'Power button location on smartphone'
        }
      },
      {
        id: 'step-2',
        title: 'Understanding the home screen',
        content: 'The home screen is like the front door of your phone. You\'ll see colorful squares called "apps" (short for applications - these are like tools or programs). Each app does something different - like making calls, sending messages, or checking the weather.',
        type: 'instruction'
      },
      {
        id: 'step-3',
        title: 'Making your first call',
        content: 'Find the green phone app (the tool for making calls) on your home screen. Tap it once with your finger. You\'ll see a number pad, just like on an old phone. Type the number you want to call, then tap the green call button.',
        type: 'instruction'
      },
      {
        id: 'quiz-1',
        title: 'Quick check',
        content: 'Let\'s make sure you understand the basics.',
        type: 'quiz',
        quiz: {
          question: 'What do you need to do to turn on your smartphone?',
          options: [
            'Tap the screen',
            'Press and hold the power button',
            'Shake the phone',
            'Press any button'
          ],
          correctAnswer: 1,
          explanation: 'That\'s right! You need to press and hold the power button for about 3 seconds to turn on your phone.'
        }
      }
    ]
  },
  {
    id: 'email-basics',
    title: 'Sending Your First Email',
    description: 'Learn how to send, receive and manage emails safely and confidently.',
    difficulty: 'beginner',
    category: 'communication',
    estimatedTime: 20,
    steps: [
      {
        id: 'email-step-1',
        title: 'What is email?',
        content: 'Email (electronic mail) is like sending a letter, but it arrives instantly. Instead of putting a letter in a postbox, you type your message and send it through the internet (the network that connects computers worldwide).',
        type: 'instruction'
      },
      {
        id: 'email-step-2',
        title: 'Opening your email app',
        content: 'Look for an app (program) that looks like an envelope. It might be called "Mail", "Gmail", or "Email". Tap it to open.',
        type: 'instruction'
      },
      {
        id: 'email-step-3',
        title: 'Writing a new email',
        content: 'Look for a button that says "New" or shows a pencil icon. Tap this to start writing a new email.',
        type: 'instruction'
      },
      {
        id: 'email-step-4',
        title: 'Adding the recipient',
        content: 'In the "To" box, type the email address of the person you want to send the message to. An email address looks like: name@example.com',
        type: 'instruction'
      },
      {
        id: 'email-quiz-1',
        title: 'Email knowledge check',
        content: 'Test your understanding of email basics.',
        type: 'quiz',
        quiz: {
          question: 'What does an email address always contain?',
          options: [
            'A phone number',
            'An @ symbol',
            'A postal address',
            'A password'
          ],
          correctAnswer: 1,
          explanation: 'Correct! Every email address has an @ symbol. It separates the person\'s name from the email provider (like Gmail or Yahoo).'
        }
      }
    ]
  },
  {
    id: 'online-safety',
    title: 'Staying Safe Online',
    description: 'Learn how to protect yourself from scams and stay secure when using the internet.',
    difficulty: 'beginner',
    category: 'safety',
    estimatedTime: 25,
    steps: [
      {
        id: 'safety-step-1',
        title: 'Recognising suspicious messages',
        content: 'Be careful of messages that ask for personal information like passwords, bank details, or personal details. Legitimate companies will never ask for this information by email or text.',
        type: 'instruction'
      },
      {
        id: 'safety-step-2',
        title: 'Creating strong passwords',
        content: 'A good password is like a strong lock on your door. Use a mix of letters, numbers, and symbols. Make it at least 8 characters long. Avoid using your name, birthday, or simple words like "password".',
        type: 'instruction'
      },
      {
        id: 'safety-step-3',
        title: 'What to do if something feels wrong',
        content: 'Trust your instincts. If something doesn\'t feel right, don\'t click on it. You can always ask for help from a family member, friend, or visit your local library for assistance.',
        type: 'instruction'
      },
      {
        id: 'safety-quiz-1',
        title: 'Safety awareness check',
        content: 'Let\'s check your understanding of online safety.',
        type: 'quiz',
        quiz: {
          question: 'What should you do if you receive an unexpected email asking for your bank details?',
          options: [
            'Reply with your information immediately',
            'Click all the links to learn more',
            'Delete the email and contact your bank directly',
            'Forward it to all your friends'
          ],
          correctAnswer: 2,
          explanation: 'Excellent! Never give out personal information in emails. Always contact your bank directly using the phone number on your bank card or statements.'
        }
      }
    ]
  }
];

export const sampleLocalResources: LocalResource[] = [
  {
    id: 'birmingham-central-library',
    name: 'Birmingham Central Library',
    type: 'library',
    description: 'Free computer classes every Tuesday and Thursday. One-to-one support available by appointment.',
    address: 'Centenary Square, Broad Street',
    postcode: 'B1 2ND',
    phone: '0121 303 4511',
    email: 'central.library@birmingham.gov.uk',
    website: 'www.birmingham.gov.uk/libraries',
    openingHours: 'Mon-Thu: 9am-8pm, Fri-Sat: 9am-5pm, Sun: 11am-4pm',
    services: [
      'Free computer access',
      'Digital skills classes',
      'One-to-one support',
      'Printing and scanning',
      'Free WiFi'
    ],
    accessibility: [
      'Wheelchair accessible',
      'Hearing loop available',
      'Large print keyboards',
      'Screen reading software'
    ],
    coordinates: {
      lat: 52.4782,
      lng: -1.9070
    }
  },
  {
    id: 'manchester-age-uk',
    name: 'Age UK Manchester - Digital Inclusion Hub',
    type: 'charity',
    description: 'Specialist support for older adults learning digital skills. Patient, friendly volunteers.',
    address: '6 Brazenose Street',
    postcode: 'M2 5BH',
    phone: '0161 833 3944',
    email: 'info@ageukmanchester.org.uk',
    website: 'www.ageukmanchester.org.uk',
    openingHours: 'Mon-Fri: 10am-4pm',
    services: [
      'Beginner-friendly classes',
      'Smartphone workshops',
      'Online safety training',
      'Device advice and setup',
      'Family video calling help'
    ],
    accessibility: [
      'Step-free access',
      'Accessible toilets',
      'Large button devices available',
      'Patient, experienced volunteers'
    ],
    coordinates: {
      lat: 53.4794,
      lng: -2.2453
    }
  },
  {
    id: 'glasgow-digital-inclusion',
    name: 'Glasgow Digital Inclusion Partnership',
    type: 'community-centre',
    description: 'Community-led digital skills sessions in multiple languages. Family-friendly environment.',
    address: '145 Cathedral Street',
    postcode: 'G4 0RH',
    phone: '0141 552 8391',
    email: 'hello@glasgowdigital.org',
    openingHours: 'Tue-Thu: 1pm-6pm, Sat: 10am-3pm',
    services: [
      'Multilingual support',
      'Family learning sessions',
      'Basic computer skills',
      'Internet safety for parents',
      'Job searching online'
    ],
    accessibility: [
      'Fully accessible building',
      'BSL interpreter available',
      'Childcare during sessions',
      'Transport assistance'
    ],
    coordinates: {
      lat: 55.8609,
      lng: -4.2396
    }
  },
  {
    id: 'cardiff-connect',
    name: 'Cardiff Connect Community Centre',
    type: 'community-centre',
    description: 'Drop-in digital support sessions. No appointment needed. Friendly atmosphere.',
    address: 'Splott Road Community Centre',
    postcode: 'CF24 2BZ',
    phone: '029 2046 8191',
    email: 'connect@cardiffcommunity.wales',
    openingHours: 'Mon, Wed, Fri: 10am-2pm',
    services: [
      'Drop-in support',
      'Device lending scheme',
      'Basic internet skills',
      'Online shopping help',
      'Digital banking guidance'
    ],
    accessibility: [
      'Wheelchair accessible',
      'Parking available',
      'Welsh language support',
      'Reading glasses provided'
    ],
    coordinates: {
      lat: 51.4816,
      lng: -3.1536
    }
  },
  {
    id: 'london-adult-education',
    name: 'Tower Hamlets Adult Education Service',
    type: 'adult-education',
    description: 'Structured courses from absolute beginner to intermediate level. Certificated courses available.',
    address: 'Mulberry Place, 5 Clove Crescent',
    postcode: 'E14 2BG',
    phone: '020 7364 1800',
    email: 'adulted@towerhamlets.gov.uk',
    website: 'www.towerhamlets.gov.uk/adulteducation',
    openingHours: 'Mon-Fri: 9am-5pm',
    services: [
      'Structured courses',
      'City & Guilds qualifications',
      'English and digital skills combined',
      'Job centre partnership',
      'Career guidance'
    ],
    accessibility: [
      'Full accessibility',
      'Multiple language support',
      'Flexible learning options',
      'Financial support available'
    ],
    coordinates: {
      lat: 51.5074,
      lng: -0.0183
    }
  }
];

export const assessmentQuestions = [
  {
    id: 'priority',
    question: 'What would you most like to learn first?',
    type: 'radio' as const,
    note: 'This helps us recommend the best starting point for your learning journey.',
    options: [
      { value: 'basic-phone', label: 'Basic phone skills (making calls, sending texts, turning device on/off)' },
      { value: 'internet', label: 'Using the internet safely (browsing websites, avoiding scams)' },
      { value: 'communication', label: 'Email and staying in touch with family' },
      { value: 'services', label: 'Accessing online services (NHS, banking, shopping)' },
      { value: 'safety', label: 'Staying safe online and avoiding scams' }
    ]
  },
  {
    id: 'accessibility',
    question: 'Do you need any accessibility features to help you learn?',
    type: 'radio' as const,
    note: 'We can adjust text size and colours to make learning easier for you.',
    options: [
      { value: 'none', label: 'No specific needs' },
      { value: 'large-text', label: 'Larger text size' },
      { value: 'high-contrast', label: 'High contrast colours (better visibility)' },
      { value: 'audio', label: 'Audio descriptions and voice guidance' },
      { value: 'multiple', label: 'A combination of the above' }
    ]
  },
  {
    id: 'postcode',
    question: 'What is the first part of your postcode?',
    type: 'text' as const,
    placeholder: 'e.g. B1, M1, CF1',
    note: 'This helps us find local support centres near you. We only need the first part (letters and first number) - for example "B1" from "B1 2AA".'
  }
];