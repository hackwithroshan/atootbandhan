
import React, { useState, FormEvent, useEffect } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { DocumentArrowDownIcon } from '../../icons/DocumentArrowDownIcon';
import { ChatBubbleLeftEllipsisIcon } from '../../icons/ChatBubbleLeftEllipsisIcon';
import { CalendarDaysIcon } from '../../icons/CalendarDaysIcon';
import { MoonIcon } from '../../icons/MoonIcon';
import { UserPairIcon } from '../../icons/UserPairIcon';
import { DocumentChartBarIcon } from '../../icons/DocumentChartBarIcon';
import { LockClosedIcon } from '../../icons/LockClosedIcon';
import { 
  AstrologyDetails, 
  AstrologyKundaliData, 
  AstrologyMatchMakingData, 
  AstrologyHoroscopeData, 
  AstrologyPredictionData,
  AstrologyChatMessage,
  UserFeatures, 
  MembershipTier 
} from '../../../types';
import { GENDER_OPTIONS } from '../../../constants';
import UpgradePrompt from '../../common/UpgradePrompt'; 

type AstrologySubViewKey = 'myKundali' | 'kundaliMilan' | 'dailyHoroscope' | 'askAI' | 'forecasts';

const initialBirthDetails: AstrologyDetails = {
  name: '',
  gender: '',
  dateOfBirth: '',
  timeOfBirth: '',
  placeOfBirth: '',
};

interface AstrologyServicesViewProps {
  userFeatures: UserFeatures;
  onUpgradeClick: () => void;
}

const AstrologyServicesView: React.FC<AstrologyServicesViewProps> = ({ userFeatures, onUpgradeClick }) => {
  const [activeSubView, setActiveSubView] = useState<AstrologySubViewKey>('myKundali');
  const [birthDetails, setBirthDetails] = useState<AstrologyDetails>(initialBirthDetails);
  const [isKundaliGenerated, setIsKundaliGenerated] = useState(false);
  const [kundaliData, setKundaliData] = useState<AstrologyKundaliData | null>(null);
  const [isLoadingKundali, setIsLoadingKundali] = useState(false);

  const [partnerBirthDetails, setPartnerBirthDetails] = useState<AstrologyDetails>(initialBirthDetails);
  const [partnerProfileId, setPartnerProfileId] = useState('');
  const [usePartnerProfileId, setUsePartnerProfileId] = useState(true);
  const [matchMakingResult, setMatchMakingResult] = useState<AstrologyMatchMakingData | null>(null);
  const [isLoadingMatchMaking, setIsLoadingMatchMaking] = useState(false);
  
  const [dailyHoroscope, setDailyHoroscope] = useState<AstrologyHoroscopeData | null>(null);
  const [chatMessages, setChatMessages] = useState<AstrologyChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const [personalizedForecasts, setPersonalizedForecasts] = useState<AstrologyPredictionData | null>(null);
  const [activeForecastTab, setActiveForecastTab] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    if (isKundaliGenerated && userFeatures.astrologyAccess !== 'none') {
      setDailyHoroscope({
        moonSign: 'Cancer',
        daily: {
          love: 'A romantic encounter might surprise you today. Be open to new connections.',
          health: 'Focus on hydration and light exercises. Avoid strenuous activities.',
          career: 'A good day for collaboration. Your ideas will be well-received.',
          finance: 'Minor gains are indicated. Avoid major investments today.',
        },
      });
      setPersonalizedForecasts({
        monthly: { marriage: 'Discussions about future plans may arise. Communicate openly.', finance: 'Stable income, potential for small bonuses.', health: 'Energy levels will be good. Maintain a balanced diet.', family: 'Good time for family gatherings.'},
        yearly: { marriage: 'Strong prospects for marriage or deepening relationships this year.', finance: 'Year of growth. Plan investments carefully.', health: 'Overall good health, but pay attention to stress levels.', family: 'Important family events likely this year.'}
      });
    } else {
        setDailyHoroscope(null);
        setPersonalizedForecasts(null);
    }
  }, [isKundaliGenerated, userFeatures.astrologyAccess]);

  const handleBirthDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, target: 'user' | 'partner') => {
    const { name, value } = e.target;
    if (target === 'user') {
      setBirthDetails(prev => ({ ...prev, [name]: value }));
    } else {
      setPartnerBirthDetails(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleGenerateKundali = (e: FormEvent) => {
    e.preventDefault();
    if (userFeatures.astrologyAccess === 'none') {
        onUpgradeClick(); return;
    }
    if (!birthDetails.dateOfBirth || !birthDetails.timeOfBirth || !birthDetails.placeOfBirth || !birthDetails.name || !birthDetails.gender) {
      alert('Please fill in all your birth details (Name, Gender, DOB, TOB, POB).');
      return;
    }
    setIsLoadingKundali(true);
    // Simulating API call delay
    setTimeout(() => {
      setKundaliData({
        lagnaChart: 'Lagna Chart Generated: Ascendant Leo, Sun in 1st House',
        moonChart: 'Moon Chart Generated: Moon in Aries, 9th House',
        navamsaChart: 'Navamsa D9 Chart Generated',
        planetaryPositions: [
          { planet: 'Sun', position: 'Leo 15°' }, { planet: 'Moon', position: 'Aries 22°' }, { planet: 'Mars', position: 'Cancer 5°' },
        ],
        interpretation: {
          personality: 'You are likely a confident and creative individual.',
          career: 'Careers in leadership or creative fields might suit you well.',
          marriage: 'Harmonious marital life indicated, potential partner might be artistic.',
          health: 'Generally good health, pay attention to digestive system.',
        },
      });
      setIsKundaliGenerated(true);
      setIsLoadingKundali(false);
    }, 1500);
  };

  const handleMatchMaking = (e: FormEvent) => {
    e.preventDefault();
    if (userFeatures.astrologyAccess === 'none' || userFeatures.astrologyAccess === 'basic') {
        onUpgradeClick(); return;
    }
    if (!isKundaliGenerated) {
      alert('Please generate your Kundali first.');
      return;
    }
    setIsLoadingMatchMaking(true);
    // Simulating API call delay
    setTimeout(() => {
      setMatchMakingResult({
        compatibilityScore: 28, 
        gunMilan: [
          { aspect: 'Varna', points: '1/1' }, { aspect: 'Vasya', points: '2/2' },
          { aspect: 'Tara', points: '1.5/3' }, { aspect: 'Yoni', points: '3/4' },
          { aspect: 'Graha Maitri', points: '4/5' }, { aspect: 'Gana', points: '5/6' },
          { aspect: 'Bhakoot', points: '7/7' }, { aspect: 'Nadi', points: '8/8' },
        ],
        doshas: [
          { name: 'Mangal Dosha', present: false, remarks: 'Absent' },
          { name: 'Nadi Dosha', present: false, remarks: 'Absent' },
        ],
        summary: 'This match shows excellent potential for emotional understanding and shared values.',
      });
      setIsLoadingMatchMaking(false);
    }, 1500);
  };

  const handleAskAIChat = () => {
    if (userFeatures.astrologyAccess !== 'premium' && userFeatures.astrologyAccess !== 'advanced') { 
        onUpgradeClick(); return;
    }
    if (!chatInput.trim()) return;
    const userMessage: AstrologyChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput, timestamp: new Date().toLocaleTimeString() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      let aiText = "I'm here to help with general astrological queries. ";
      if (chatInput.toLowerCase().includes("marriage")) {
        aiText += isKundaliGenerated ? "Based on your Kundali, marriage prospects seem favorable in the coming years." : "Tell me your birth details so I can provide a more specific insight about marriage.";
      } else if (chatInput.toLowerCase().includes("career")) {
        aiText += isKundaliGenerated ? "Your career path indicates growth through perseverance." : "For career insights, please provide your birth details.";
      } else {
        aiText += "What specific astrological question do you have? (e.g., about love, career, timing of events)";
      }
      const aiMessage: AstrologyChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiText, timestamp: new Date().toLocaleTimeString() };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);
    }, 1200);
  };
  
  const renderBirthDetailsForm = (target: 'user' | 'partner') => {
    const details = target === 'user' ? birthDetails : partnerBirthDetails;
    return (
      <>
        <Input type="text" id={`${target}Name`} name="name" label="Name" value={details.name} onChange={(e) => handleBirthDetailsChange(e, target)} required />
        <Select id={`${target}Gender`} name="gender" label="Gender" options={GENDER_OPTIONS} value={details.gender} onChange={(e) => handleBirthDetailsChange(e, target)} required />
        <Input type="date" id={`${target}DateOfBirth`} name="dateOfBirth" label="Date of Birth" value={details.dateOfBirth} onChange={(e) => handleBirthDetailsChange(e, target)} required />
        <Input type="time" id={`${target}TimeOfBirth`} name="timeOfBirth" label="Time of Birth" value={details.timeOfBirth} onChange={(e) => handleBirthDetailsChange(e, target)} required />
        <Input type="text" id={`${target}PlaceOfBirth`} name="placeOfBirth" label="Place of Birth (City, Country)" value={details.placeOfBirth} onChange={(e) => handleBirthDetailsChange(e, target)} placeholder="e.g., Mumbai, India" required />
      </>
    );
  }

  const renderSubView = () => {
    switch (activeSubView) {
      case 'myKundali':
        if (userFeatures.astrologyAccess === 'none') return <UpgradePrompt featureName="My Kundali View" requiredTier={MembershipTier.SILVER} onUpgradeClick={onUpgradeClick} layout="banner" />;
        return (
          <div className="space-y-4">
            <form onSubmit={handleGenerateKundali} className="bg-white p-4 rounded-lg shadow space-y-3">
              <h3 className="text-md font-semibold text-gray-700 border-b pb-1">Enter Your Birth Details</h3>
              {renderBirthDetailsForm('user')}
              <Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600" isLoading={isLoadingKundali}>
                {isLoadingKundali ? "Generating..." : "Generate My Kundali"}
              </Button>
            </form>
            {isKundaliGenerated && kundaliData && (
              <div className="bg-white p-4 rounded-lg shadow animate-fadeIn space-y-2">
                <h3 className="text-md font-semibold text-gray-700">Your Kundali Report</h3>
                <div><strong>Lagna Chart:</strong> <p className="text-xs p-2 bg-gray-50 rounded">{kundaliData.lagnaChart}</p></div>
                <div><strong>Moon Chart:</strong> <p className="text-xs p-2 bg-gray-50 rounded">{kundaliData.moonChart}</p></div>
                <div><strong>Navamsa Chart:</strong> <p className="text-xs p-2 bg-gray-50 rounded">{kundaliData.navamsaChart}</p></div>
                <div><strong>Planetary Positions:</strong> <ul className="list-disc list-inside pl-4 text-xs">{kundaliData.planetaryPositions?.map(p => <li key={p.planet}>{p.planet}: {p.position}</li>)}</ul></div>
                <div><strong>AI Interpretation:</strong>
                  <p className="text-xs mt-1"><strong>Personality:</strong> {kundaliData.interpretation?.personality}</p>
                  <p className="text-xs"><strong>Career:</strong> {kundaliData.interpretation?.career}</p>
                  <p className="text-xs"><strong>Marriage:</strong> {kundaliData.interpretation?.marriage}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => alert("Download PDF initiated.")}><DocumentArrowDownIcon className="w-4 h-4 mr-1"/>Download PDF</Button>
              </div>
            )}
          </div>
        );
      case 'kundaliMilan':
        if (userFeatures.astrologyAccess === 'none' || userFeatures.astrologyAccess === 'basic') return <UpgradePrompt featureName="Kundali Matching" requiredTier={MembershipTier.GOLD} onUpgradeClick={onUpgradeClick} layout="banner"/>;
        return (
          <div className="space-y-4">
             {!isKundaliGenerated && <p className="text-sm text-red-500 bg-red-50 p-2 rounded">Please generate your Kundali first in the "My Kundali" tab.</p>}
            <form onSubmit={handleMatchMaking} className="bg-white p-4 rounded-lg shadow space-y-3">
              <h3 className="text-md font-semibold text-gray-700 border-b pb-1">Partner's Details for Matching</h3>
              <div className="flex items-center space-x-4">
                  <Button type="button" onClick={() => setUsePartnerProfileId(true)} variant={usePartnerProfileId ? "primary" : "secondary"} size="sm">Use Profile ID</Button>
                  <Button type="button" onClick={() => setUsePartnerProfileId(false)} variant={!usePartnerProfileId ? "primary" : "secondary"} size="sm">Enter Manually</Button>
              </div>
              {usePartnerProfileId ? (
                <Input type="text" id="partnerProfileId" name="partnerProfileId" label="Partner's Profile ID" value={partnerProfileId} onChange={(e) => setPartnerProfileId(e.target.value)} placeholder="Enter Partner's Profile ID" />
              ) : (
                renderBirthDetailsForm('partner')
              )}
              <Button type="submit" variant="primary" className="!bg-indigo-500 hover:!bg-indigo-600" disabled={!isKundaliGenerated} isLoading={isLoadingMatchMaking}>
                {isLoadingMatchMaking ? "Calculating..." : "Calculate Kundali Milan"}
              </Button>
            </form>
            {matchMakingResult && (
              <div className="bg-white p-4 rounded-lg shadow animate-fadeIn space-y-2">
                <h3 className="text-md font-semibold text-gray-700">Kundali Milan Result with {usePartnerProfileId ? partnerProfileId : partnerBirthDetails.name}</h3>
                <p><strong>Compatibility Score:</strong> {matchMakingResult.compatibilityScore}/36</p>
                <div><strong>Gun Milan:</strong> <ul className="list-disc list-inside pl-4 text-xs">{matchMakingResult.gunMilan?.map(g => <li key={g.aspect}>{g.aspect}: {g.points}</li>)}</ul></div>
                <div><strong>Doshas:</strong> <ul className="list-disc list-inside pl-4 text-xs">{matchMakingResult.doshas?.map(d => <li key={d.name}>{d.name}: {d.present ? `Present (${d.remarks || ''})` : 'Absent'}</li>)}</ul></div>
                <p><strong>AI Summary:</strong> {matchMakingResult.summary}</p>
                 {userFeatures.astrologyAccess === 'premium' && <Button variant="secondary" size="sm" onClick={() => alert("Download Detailed Match Report PDF initiated.")}><DocumentArrowDownIcon className="w-4 h-4 mr-1"/>Download Full Report</Button> }
              </div>
            )}
          </div>
        );
      case 'dailyHoroscope':
        if (userFeatures.astrologyAccess === 'none' || userFeatures.astrologyAccess === 'basic') return <UpgradePrompt featureName="Daily Horoscope" requiredTier={MembershipTier.GOLD} onUpgradeClick={onUpgradeClick} layout="banner" />;
        return (
          <div className="bg-white p-4 rounded-lg shadow space-y-2">
            <h3 className="text-md font-semibold text-gray-700">Your Daily Horoscope</h3>
            {dailyHoroscope ? (
              <>
                <p><strong>Moon Sign:</strong> {dailyHoroscope.moonSign}</p>
                <p><strong>Love:</strong> {dailyHoroscope.daily?.love}</p>
                <p><strong>Health:</strong> {dailyHoroscope.daily?.health}</p>
                <p><strong>Career:</strong> {dailyHoroscope.daily?.career}</p>
                <p><strong>Finance:</strong> {dailyHoroscope.daily?.finance}</p>
                <Button variant="secondary" size="sm" onClick={() => alert("Daily horoscope reminders configured.")} className="mt-2">Set Daily Reminders</Button>
              </>
            ) : <p>Generate your Kundali to view your daily horoscope.</p>}
          </div>
        );
       case 'askAI':
        if (userFeatures.astrologyAccess !== 'premium' && userFeatures.astrologyAccess !== 'advanced') return <UpgradePrompt featureName="AI Astrologer Chat" requiredTier={MembershipTier.DIAMOND} onUpgradeClick={onUpgradeClick} layout="banner"/>; 
        return (
          <div className="bg-white p-4 rounded-lg shadow h-[400px] flex flex-col">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Ask AI Astrologer</h3>
            <div className="flex-grow overflow-y-auto space-y-2 mb-2 p-2 bg-gray-50 rounded custom-scrollbar">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-1.5 rounded-lg shadow-sm text-xs ${msg.sender === 'user' ? 'bg-rose-500 text-white' : 'bg-indigo-100 text-indigo-800'}`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-0.5 ${msg.sender === 'user' ? 'text-rose-200' : 'text-indigo-400'} text-right`}>{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              {isAiTyping && <div className="text-xs text-gray-500 italic">AI Astrologer is typing...</div>}
            </div>
            <div className="flex items-center space-x-2">
              <Input type="text" id="chatInput" name="chatInput" label="Your Question" className="flex-grow [&_label]:sr-only !mb-0" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask an astrological question..." onKeyPress={e => e.key === 'Enter' && handleAskAIChat()}/>
              <Button onClick={handleAskAIChat} variant="primary" size="sm" className="!bg-indigo-500 hover:!bg-indigo-600">Ask</Button>
            </div>
             <p className="text-[10px] text-gray-400 mt-1 text-center">Disclaimer: This is AI-generated and for general guidance only. Consult a professional astrologer for critical decisions.</p>
          </div>
        );
      case 'forecasts':
        if (userFeatures.astrologyAccess !== 'premium') return <UpgradePrompt featureName="Personalized Forecasts" requiredTier={MembershipTier.DIAMOND} onUpgradeClick={onUpgradeClick} layout="banner"/>;
        return (
          <div className="bg-white p-4 rounded-lg shadow space-y-3">
            <h3 className="text-md font-semibold text-gray-700">Personalized Forecasts</h3>
            <div className="flex border-b">
                <button onClick={() => setActiveForecastTab('monthly')} className={`py-1 px-2 text-xs ${activeForecastTab === 'monthly' ? 'border-b-2 border-rose-500 text-rose-600' : 'text-gray-500'}`}>Monthly</button>
                <button onClick={() => setActiveForecastTab('yearly')} className={`py-1 px-2 text-xs ${activeForecastTab === 'yearly' ? 'border-b-2 border-rose-500 text-rose-600' : 'text-gray-500'}`}>Yearly</button>
            </div>
            {personalizedForecasts ? (
              activeForecastTab === 'monthly' ? (
                <>
                  <p><strong>Marriage:</strong> {personalizedForecasts.monthly?.marriage}</p>
                  <p><strong>Finance:</strong> {personalizedForecasts.monthly?.finance}</p>
                </>
              ) : (
                <>
                  <p><strong>Marriage:</strong> {personalizedForecasts.yearly?.marriage}</p>
                  <p><strong>Finance:</strong> {personalizedForecasts.yearly?.finance}</p>
                </>
              )
            ) : <p>Generate your Kundali to view personalized forecasts.</p>}
          </div>
        );
      default: return null;
    }
  };
  
  const subViewConfig = [
    { key: 'myKundali', label: 'My Kundali', icon: <DocumentChartBarIcon className="w-4 h-4 mr-1"/>, requiredAccessLevels: [MembershipTier.SILVER, MembershipTier.GOLD, MembershipTier.DIAMOND] },
    { key: 'kundaliMilan', label: 'Kundali Milan', icon: <UserPairIcon className="w-4 h-4 mr-1"/>, requiredAccessLevels: [MembershipTier.GOLD, MembershipTier.DIAMOND] },
    { key: 'dailyHoroscope', label: 'Daily Horoscope', icon: <MoonIcon className="w-4 h-4 mr-1"/>, requiredAccessLevels: [MembershipTier.GOLD, MembershipTier.DIAMOND] },
    { key: 'askAI', label: 'Ask AI Astrologer', icon: <ChatBubbleLeftEllipsisIcon className="w-4 h-4 mr-1"/>, requiredAccessLevels: [MembershipTier.DIAMOND] }, 
    { key: 'forecasts', label: 'Forecasts', icon: <CalendarDaysIcon className="w-4 h-4 mr-1"/>, requiredAccessLevels: [MembershipTier.DIAMOND] }, 
  ];

  const getRequiredTierForFeature = (featureKey: AstrologySubViewKey): MembershipTier => {
      switch (featureKey) {
          case 'myKundali': return MembershipTier.SILVER;
          case 'kundaliMilan': return MembershipTier.GOLD;
          case 'dailyHoroscope': return MembershipTier.GOLD;
          case 'askAI': return MembershipTier.DIAMOND;
          case 'forecasts': return MembershipTier.DIAMOND;
          default: return MembershipTier.DIAMOND; // Fallback
      }
  };

  if (userFeatures.astrologyAccess === 'none') {
    return (
      <div className="space-y-5">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="w-7 h-7 text-rose-500" />
          <h2 className="text-xl font-semibold text-gray-800">Astrology Services</h2>
        </div>
        <UpgradePrompt featureName="Astrology Services" requiredTier={MembershipTier.SILVER} onUpgradeClick={onUpgradeClick} layout="banner" />
         <p className="text-xs text-center text-gray-500 italic px-4">
            Astrological insights are for general guidance. Consult a professional for critical decisions.
         </p>
      </div>
    );
  }


  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-3">
        <SparklesIcon className="w-7 h-7 text-rose-500" />
        <h2 className="text-xl font-semibold text-gray-800">Astrology Services</h2>
      </div>
      
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <div className="flex space-x-1 border-b border-gray-200 pb-1 overflow-x-auto">
          {subViewConfig.map(tab => {
            let tabAccessible = false;
            if (tab.key === 'myKundali') tabAccessible = userFeatures.astrologyAccess !== 'none';
            else if (tab.key === 'kundaliMilan' || tab.key === 'dailyHoroscope') tabAccessible = userFeatures.astrologyAccess === 'advanced' || userFeatures.astrologyAccess === 'premium';
            else if (tab.key === 'askAI' || tab.key === 'forecasts') tabAccessible = userFeatures.astrologyAccess === 'premium';

            return (
            <Button
              key={tab.key}
              variant={activeSubView === tab.key && tabAccessible ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                  if(tabAccessible) setActiveSubView(tab.key as AstrologySubViewKey);
                  else onUpgradeClick();
              }}
              className={`!text-xs flex-shrink-0 ${activeSubView === tab.key && tabAccessible ? '!bg-rose-500 hover:!bg-rose-600' : (tabAccessible ? '!bg-gray-100 hover:!bg-gray-200 !text-gray-700' : '!bg-gray-100 !text-gray-400 cursor-not-allowed')}`}
              disabled={!tabAccessible && activeSubView !== tab.key}
              title={!tabAccessible ? `Upgrade to ${getRequiredTierForFeature(tab.key as AstrologySubViewKey)} to access` : tab.label}
            >
              {tab.icon} {tab.label} {!tabAccessible && <LockClosedIcon className="w-3 h-3 ml-1 text-yellow-500"/>}
            </Button>
          )})}
        </div>
        <div className="pt-3 text-sm">
          {renderSubView()}
        </div>
      </div>
      
      {userFeatures.astrologyAccess !== 'premium' && (
        <div className="bg-rose-50 p-3 rounded-lg shadow-sm text-center">
            <p className="text-xs text-rose-700">✨ Unlock detailed reports and premium astrology features! ✨</p>
            <Button variant="primary" size="sm" className="!bg-yellow-500 hover:!bg-yellow-600 !text-black mt-1 !text-xs" onClick={onUpgradeClick}>
                Upgrade to Premium
            </Button>
        </div>
      )}

      <p className="text-xs text-center text-gray-500 italic px-4">
        Disclaimer: Astrological insights provided are AI-generated and intended for general guidance and entertainment purposes only. For critical life decisions, please consult a qualified professional astrologer. All user data is handled with utmost confidentiality.
      </p>
    </div>
  );
};

export default AstrologyServicesView;
