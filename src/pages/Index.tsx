import DigitalSkillsCoach from '../components/DigitalSkillsCoach';
import DebugComponent from '../debug';

const Index = () => {
  // Temporary debug mode - remove when preview confirmed working
  const isDebugMode = window.location.search.includes('debug');
  
  if (isDebugMode) {
    return <DebugComponent />;
  }
  
  return <DigitalSkillsCoach />;
};

export default Index;
