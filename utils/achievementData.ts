import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // ECONOMY
  {
    id: 'ECON_CRASH',
    title: "Stonks Only Go Down",
    description: "Successfully reduced your GDP by 50% in record time.",
    condition: "GDP drops by 50% from start or reaches critically low levels.",
    category: 'Economy'
  },
  {
    id: 'ECON_INFLATION',
    title: "Wheelbarrow Money",
    description: "Inflation is so high, money is cheaper than wallpaper.",
    condition: "Inflation exceeds 50%.",
    category: 'Economy'
  },
  {
    id: 'ECON_DEBT',
    title: "Put It On My Tab",
    description: "You owe more money than exists in the known universe.",
    condition: "Treasury reaches negative $1 Trillion.",
    category: 'Economy'
  },
  {
    id: 'ECON_SURPLUS',
    title: "Dragon's Hoard",
    description: "You're sitting on a pile of gold while everyone else starves.",
    condition: "Treasury exceeds GDP.",
    category: 'Economy'
  },
  {
    id: 'ECON_TAX',
    title: "Robber Baron",
    description: "Taxed the population until their pockets were literally empty.",
    condition: "Corruption > 80% and GDP > $1 Trillion.",
    category: 'Economy'
  },
  {
    id: 'ECON_DEFAULT',
    title: "New Phone Who Dis",
    description: "Ghosted the IMF and defaulted on all national loans.",
    condition: "Trigger a sovereign default.",
    category: 'Economy'
  },
  {
    id: 'ECON_SALE',
    title: "Everything Must Go",
    description: "Sold off national parks, monuments, and perhaps a city or two.",
    condition: "Privatize major state assets to fix debt.",
    category: 'Economy'
  },

  // MILITARY
  {
    id: 'MIL_COUP',
    title: "Et Tu, Brute?",
    description: "The classic 'you're fired' but with tanks.",
    condition: "Get overthrown by a military coup.",
    category: 'Military'
  },
  {
    id: 'MIL_NUKE',
    title: "The Big Red Button",
    description: "You pressed it. We told you not to, but you did.",
    condition: "Authorize a nuclear strike.",
    category: 'Military'
  },
  {
    id: 'MIL_LOSS',
    title: "Tactical Retreat",
    description: "Lost a war in embarrassing fashion.",
    condition: "Surrender or lose territory in a war.",
    category: 'Military'
  },
  {
    id: 'MIL_SPEND',
    title: "Toy Soldiers",
    description: "Spent the entire education budget on one cool jet.",
    condition: "Military Readiness 100% while Healthcare < 20%.",
    category: 'Military'
  },
  {
    id: 'MIL_PEACE',
    title: "Hippie Commander",
    description: "Disbanded the army to buy flower crowns.",
    condition: "Military Readiness hits 0%.",
    category: 'Military'
  },
  {
    id: 'MIL_INVADE',
    title: "Accidental Imperialist",
    description: "Invaded a neighbor because you misread the map.",
    condition: "Start an unprovoked war.",
    category: 'Military'
  },
  {
    id: 'MIL_ALLIANCE',
    title: "NATO? Never Heard of Her",
    description: "Left every major alliance to go it alone.",
    condition: "Withdraw from international defense treaties.",
    category: 'Military'
  },

  // DOMESTIC
  {
    id: 'DOM_APPROVAL_0',
    title: "Universally Despised",
    description: "Even your mom disapproved of your administration.",
    condition: "Approval Rating hits 0%.",
    category: 'Domestic'
  },
  {
    id: 'DOM_APPROVAL_100',
    title: "God Emperor",
    description: "Everyone loves you. Or they're too scared to say otherwise.",
    condition: "Approval Rating hits 100%.",
    category: 'Domestic'
  },
  {
    id: 'DOM_RIOT',
    title: "Burn It All Down",
    description: "The capital is on fire, but the marshmallows are roasting nicely.",
    condition: "Civil Unrest hits 100%.",
    category: 'Domestic'
  },
  {
    id: 'DOM_POLICE',
    title: "Big Brother",
    description: "Installed cameras in the cameras.",
    condition: "Implement extreme surveillance state measures.",
    category: 'Domestic'
  },
  {
    id: 'DOM_HEALTH',
    title: "Just Walk It Off",
    description: "Replaced healthcare with 'positive vibes'.",
    condition: "Healthcare drops below 10%.",
    category: 'Domestic'
  },
  {
    id: 'DOM_THEOCRACY',
    title: "Holy Roller",
    description: "Replaced the constitution with a holy book.",
    condition: "Declare a theocracy or religious state.",
    category: 'Domestic'
  },
  {
    id: 'DOM_BUREAUCRACY',
    title: "Form 27B/6",
    description: "Created a department to oversee the department of oversight.",
    condition: "Corruption > 50% and Stability < 50%.",
    category: 'Domestic'
  },

  // DIPLOMACY
  {
    id: 'DIP_WAR_ALL',
    title: "Me Against The World",
    description: "At war with at least 3 countries simultaneously.",
    condition: "War with 3+ nations.",
    category: 'Diplomacy'
  },
  {
    id: 'DIP_ISOLATION',
    title: "Hermit Kingdom",
    description: "Closed borders, closed ports, closed minds.",
    condition: "International Tension > 90% and no alliances.",
    category: 'Diplomacy'
  },
  {
    id: 'DIP_TRADE',
    title: "Trade War Champion",
    description: "Put tariffs on oxygen imports.",
    condition: "Start a massive trade war.",
    category: 'Diplomacy'
  },
  {
    id: 'DIP_UNION',
    title: "Super State",
    description: "Formed a new continental union just for the cool flag.",
    condition: "Form a major new international union.",
    category: 'Diplomacy'
  },
  {
    id: 'DIP_INSULT',
    title: "Diplomatic Immunity",
    description: "Publicly insulted a superpower leader and lived.",
    condition: "Insult a major power without getting invaded.",
    category: 'Diplomacy'
  },
  {
    id: 'DIP_PEACE_PRIZE',
    title: "Irony Award",
    description: "Won a Peace Prize while actively bombing someone.",
    condition: "Win Nobel Peace Prize with Military Readiness > 80%.",
    category: 'Diplomacy'
  },
  {
    id: 'DIP_SPY',
    title: "00-Whoops",
    description: "Your top spy was caught posting selfies on mission.",
    condition: "Major intelligence failure or leak.",
    category: 'Diplomacy'
  },

  // SCANDALS
  {
    id: 'SCA_BRIBE',
    title: "Lobbyist's Dream",
    description: "Accepted a bribe on live television.",
    condition: "Corruption increases by 20% in one turn.",
    category: 'Scandals'
  },
  {
    id: 'SCA_RESIGN',
    title: "I Am Not A Crook",
    description: "Resigned in disgrace. Nixon would be proud.",
    condition: "Resign due to scandal.",
    category: 'Scandals'
  },
  {
    id: 'SCA_TAPE',
    title: "Hot Mic",
    description: "Caught insulting your own voters on a hot microphone.",
    condition: "Scandal causes massive approval drop.",
    category: 'Scandals'
  },
  {
    id: 'SCA_FAMILY',
    title: "Nepo Baby",
    description: "Appointed your pet cat to the cabinet.",
    condition: "Appoint unqualified family members to power.",
    category: 'Scandals'
  },
  {
    id: 'SCA_PARTY',
    title: "Party Animal",
    description: "Hosted a rave during a national emergency.",
    condition: "Ignore a crisis to do something frivolous.",
    category: 'Scandals'
  },
  {
    id: 'SCA_EMBEZZLE',
    title: "Offshore Accounts",
    description: "Your Swiss bank account has a Swiss bank account.",
    condition: "Embezzle significant state funds.",
    category: 'Scandals'
  },
  {
    id: 'SCA_COVERUP',
    title: "Streisand Effect",
    description: "Tried to ban a photo, made it the national flag.",
    condition: "Fail a cover-up attempt spectacularly.",
    category: 'Scandals'
  },

  // SOCIAL
  {
    id: 'SOC_MEME',
    title: "Meme Lord",
    description: "Became the internet's favorite joke.",
    condition: "Become a viral meme due to incompetence.",
    category: 'Social'
  },
  {
    id: 'SOC_CANCEL',
    title: "Cancelled",
    description: "Got cancelled by Gen Z for a tweet from 2009.",
    condition: "Face a social media backlash.",
    category: 'Social'
  },
  {
    id: 'SOC_TREND',
    title: "TikTok Diplomat",
    description: "Announced a declaration of war via a dance challenge.",
    condition: "Use social media for serious government business.",
    category: 'Social'
  },
  {
    id: 'SOC_FAKE',
    title: "Fake News Factory",
    description: "Reality is whatever you say it is.",
    condition: "Successfully spread disinformation.",
    category: 'Social'
  },
  {
    id: 'SOC_CULT',
    title: "Drink the Kool-Aid",
    description: "It's not a cult, it's a 'lifestyle community'.",
    condition: "Establish a personality cult.",
    category: 'Social'
  },
  {
    id: 'SOC_SPACE',
    title: "Mars or Bust",
    description: "Announced a space program while people are starving.",
    condition: "Start space program with Unemployment > 20%.",
    category: 'Social'
  },
  {
    id: 'SOC_SPORT',
    title: "Sportswashing",
    description: "Hosted the World Cup to hide the war crimes.",
    condition: "Host a major sporting event during a crisis.",
    category: 'Social'
  },

  // CHAOS
  {
    id: 'CHA_METEOR',
    title: "Dinosaur Moment",
    description: "Looked up, saw the meteor, shrugged.",
    condition: "Fail to address a natural disaster.",
    category: 'Chaos'
  },
  {
    id: 'CHA_ALIEN',
    title: "I Want to Believe",
    description: "Established diplomatic relations with Martians.",
    condition: "Trigger an alien contact event.",
    category: 'Chaos'
  },
  {
    id: 'CHA_AI',
    title: "Skynet Activated",
    description: "Let the AI run the government. What could go wrong?",
    condition: "Hand over control to an automated system.",
    category: 'Chaos'
  },
  {
    id: 'CHA_PLAGUE',
    title: "Cough Heard Round the World",
    description: "Ignored the scientists, now everyone is a zombie.",
    condition: "Mishandle a pandemic or plague.",
    category: 'Chaos'
  },
  {
    id: 'CHA_SIM',
    title: "Glitch in the Matrix",
    description: "Broke the simulation logic.",
    condition: "Do something logically impossible.",
    category: 'Chaos'
  },
  {
    id: 'CHA_SPEEDRUN',
    title: "Any% Ruin",
    description: "Destroyed the country in less than 5 turns.",
    condition: "Game Over in < 5 turns.",
    category: 'Chaos'
  },
  {
    id: 'CHA_IMMORTAL',
    title: "Vampire Leader",
    description: "Stayed in power way longer than legally allowed.",
    condition: "Survive past Day 1000 or change term limits.",
    category: 'Chaos'
  }
];