import React, { useState } from 'react';
import {
  ArrowRightIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/solid';
import { sound } from '../audio/sound';
import { LogoMark } from './Logo';
import { Rise } from './Reveal';
import { getDiceBearAvatar } from '../utils/dicebear';

interface ChatScenario {
  id: string;
  title: string;
  groupName: string;
  members: string;
  messages: Array<{
    sender: string;
    avatar: string;
    time: string;
    text?: string;
    isCard?: boolean;
    cardData?: {
      question: string;
      verdict: string;
      options: string[];
      hash: string;
    };
    isUser?: boolean;
  }>;
}

const CHAT_SCENARIOS: ChatScenario[] = [
  {
    id: 'dinner',
    title: 'The Dinner Indecision',
    groupName: 'Friday Squad (4)',
    members: 'Alex, Sarah, Liam, Jordan',
    messages: [
      {
        sender: 'Alex',
        avatar: getDiceBearAvatar('Alex', 'lorelei', 80),
        time: '7:02 PM',
        text: 'Where are we eating tonight? Starving.'
      },
      {
        sender: 'Sarah',
        avatar: getDiceBearAvatar('Sarah', 'adventurer', 80),
        time: '7:03 PM',
        text: 'Idk anything except pizza, had that yesterday.'
      },
      {
        sender: 'Liam',
        avatar: getDiceBearAvatar('Liam', 'bottts', 80),
        time: '7:03 PM',
        text: "I'm good with literally anything, you guys pick."
      },
      {
        sender: 'Jordan',
        avatar: getDiceBearAvatar('Jordan', 'notionists', 80),
        time: '7:04 PM',
        isUser: true,
        text: 'Ending the 30 minute debate right now:'
      },
      {
        sender: 'Jordan',
        avatar: getDiceBearAvatar('Jordan', 'notionists', 80),
        time: '7:04 PM',
        isUser: true,
        isCard: true,
        cardData: {
          question: 'Dinner Destination?',
          verdict: 'Ramen Bowl',
          options: ['Ramen Bowl', 'Street Tacos', 'Smash Burgers', 'Thai Curry'],
          hash: '#nd-9481a'
        }
      },
      {
        sender: 'Liam',
        avatar: getDiceBearAvatar('Liam', 'bottts', 80),
        time: '7:05 PM',
        text: 'Say less. Table for 4 at 7:30.'
      }
    ]
  },
  {
    id: 'coffee',
    title: 'The Morning Coffee Bet',
    groupName: 'Design Team Standup (5)',
    members: 'Maya, Chris, Daniel, Chloe, Marcus',
    messages: [
      {
        sender: 'Maya',
        avatar: getDiceBearAvatar('Maya', 'micah', 80),
        time: '8:45 AM',
        text: 'Who is buying the morning espresso round today?'
      },
      {
        sender: 'Chris',
        avatar: getDiceBearAvatar('Chris', 'adventurer', 80),
        time: '8:46 AM',
        text: 'I bought Tuesday! Not it.'
      },
      {
        sender: 'Daniel',
        avatar: getDiceBearAvatar('Daniel', 'notionists', 80),
        time: '8:46 AM',
        isUser: true,
        isCard: true,
        cardData: {
          question: 'Who buys the coffee round?',
          verdict: 'Chris buys today',
          options: ['Maya', 'Chris', 'Daniel', 'Chloe', 'Marcus'],
          hash: '#nd-3f7c2'
        }
      },
      {
        sender: 'Chris',
        avatar: getDiceBearAvatar('Chris', 'adventurer', 80),
        time: '8:47 AM',
        text: 'Dang it machine never lies... Oat lattes for everyone on me.'
      }
    ]
  }
];

interface ChatShowcaseProps {
  onTryIt: () => void;
}

export const ChatShowcase: React.FC<ChatShowcaseProps> = ({ onTryIt }) => {
  const [activeTab, setActiveTab] = useState<string>('dinner');
  const currentScenario = CHAT_SCENARIOS.find(s => s.id === activeTab) || CHAT_SCENARIOS[0];

  return (
    <section id="group-chat" className="py-10 px-4 bg-canvas">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <Rise className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-white border border-ink-200 px-3.5 py-1 rounded-full text-xs font-bold text-ink-700 mb-3">
            <span>In The Wild</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight mb-2">
            The 40-minute group chat deadlock, solved.
          </h2>
          <p className="text-sm sm:text-base text-ink-600 leading-relaxed">
            One link drops in the chat. The machine picks. Everyone agrees and moves on.
          </p>
        </Rise>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white border border-ink-200 p-1.5 rounded-full flex space-x-2">
            {CHAT_SCENARIOS.map((scenario) => {
              const isActive = scenario.id === activeTab;
              return (
                <button
                  key={scenario.id}
                  onClick={() => {
                    sound.tap();
                    setActiveTab(scenario.id);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-ink-900 text-white'
                      : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                  }`}
                >
                  {scenario.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Realistic iPhone Mockup Container */}
        <Rise y={32} className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-3 sm:p-4">
          
          {/* Phone Shell Header */}
          <div className="bg-ink-900 text-white rounded-2xl p-4 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs">
                  {currentScenario.groupName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight text-white">{currentScenario.groupName}</h4>
                  <p className="text-[10px] text-ink-300 truncate max-w-[180px]">{currentScenario.members}</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* Messages Stream */}
          <div className="bg-canvas border border-ink-100 rounded-2xl p-4 space-y-3.5 min-h-[380px] flex flex-col justify-end">
            {currentScenario.messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex items-end space-x-2.5 ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <img 
                  src={msg.avatar} 
                  alt={msg.sender} 
                  className="w-7 h-7 rounded-full object-cover border border-white flex-shrink-0"
                />

                {/* Bubble */}
                <div className={`${msg.isCard ? 'w-[88%] max-w-[260px]' : 'max-w-[78%]'} ${msg.isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center space-x-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-ink-500">{msg.sender}</span>
                    <span className="text-[9px] text-ink-400">{msg.time}</span>
                  </div>

                  {msg.isCard && msg.cardData ? (
                    <div className="bg-white rounded-2xl p-3.5 font-mono">
                      <div className="flex items-center gap-1.5 border-b border-ink-200 pb-2 mb-2.5">
                        <LogoMark className="w-4 h-4 shrink-0" />
                        <span className="font-extrabold text-ink-900 text-[9px] tracking-wider uppercase font-sans">No debates verdict</span>
                        <span className="ml-auto text-[8px] text-ink-400 uppercase whitespace-nowrap">{msg.time}</span>
                      </div>
                      <div className="font-sans mb-2.5">
                        <span className="text-[8px] uppercase font-bold text-ink-400 block mb-0.5">Question</span>
                        <span className="text-[12px] font-bold text-ink-900 leading-snug block">“{msg.cardData.question}”</span>
                      </div>
                      <div className="bg-canvas rounded-xl p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={getDiceBearAvatar(msg.cardData.verdict, 'bottts', 32)}
                              alt=""
                              className="w-8 h-8 rounded-lg bg-white p-0.5 border border-ink-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-[8px] uppercase font-bold text-ink-400 block leading-none font-sans mb-1">Verdict</span>
                              <span className="text-[13px] font-extrabold uppercase text-accent leading-tight font-sans block">{msg.cardData.verdict}</span>
                            </div>
                          </div>
                          <span className="bg-accent-soft text-accent text-[8px] font-extrabold px-2 py-1 rounded-full border border-accent/20 font-sans whitespace-nowrap">SEALED</span>
                        </div>
                      </div>
                      <div className="pt-2 mt-2.5 border-t border-dashed border-ink-200 flex items-center justify-between text-[8px] text-ink-400">
                        <span>HASH: {msg.cardData.hash}</span>
                        <span className="text-emerald-600 font-bold">100% UNBIASED</span>
                      </div>
                    </div>
                  ) : (
                    <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.isUser 
                        ? 'bg-ink-900 text-white rounded-br-sm' 
                        : 'bg-white border border-ink-100 text-ink-800 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Fake Message Input Bar */}
          <div className="mt-3 flex items-center space-x-2 bg-ink-50 rounded-2xl px-3.5 py-2 border border-ink-100">
            <input 
              type="text" 
              readOnly 
              placeholder="Verdict is final! No more debates..."
              className="bg-transparent text-xs text-ink-500 placeholder-ink-400 focus:outline-none flex-1"
            />
            <button 
              onClick={() => {
                sound.tap();
                onTryIt();
              }}
              className="bg-accent text-white p-1.5 rounded-full hover:bg-accent-hover transition-colors"
              title="Try It Now"
            >
              <PaperAirplaneIcon className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
        </Rise>

        {/* Call to action below phone */}
        <div className="text-center mt-8">
          <button
            onClick={() => {
              sound.click();
              onTryIt();
            }}
            className="btn-primary text-xs px-6 py-3 inline-flex items-center space-x-2"
          >
            <span>Try spinning your own decision</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
