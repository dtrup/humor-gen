import React, { useState } from 'react';

const HumorLab = () => {
  const [topic, setTopic] = useState('');
  const [voice, setVoice] = useState('observational');
  const [audience, setAudience] = useState('general');
  const [showBindings, setShowBindings] = useState(false);
  const [selectedBindings, setSelectedBindings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('generate');
  
  // Sliders state
  const [operations, setOperations] = useState({
    emptying: 50,
    loading: 60,
    exposure: 70,
    reflection: 20,
    reversal: 55,
    overliteralization: 40,
    categoryCrossing: 45,
    compression: 65
  });
  
  const [style, setStyle] = useState({
    violation: 50,
    abstraction: 40,
    verbosity: 30,
    meta: 25,
    darkness: 35,
    wordplay: 45
  });

  // Sample data for demo
  const sampleBindings = {
    'video calls': [
      { id: 1, carrier: '"You\'re on mute"', default: 'Helpful technical notification', strength: 95, alternatives: ['Public humiliation moment', 'Existential void announcement'] },
      { id: 2, carrier: 'Professional background', default: 'Curated workspace image', strength: 85, alternatives: ['Elaborate fiction about your life', 'Witness protection aesthetic'] },
      { id: 3, carrier: 'Camera off', default: 'Technical/privacy choice', strength: 80, alternatives: ['Pajama indicator', 'Multitasking confession'] },
      { id: 4, carrier: '"Can everyone see my screen?"', default: 'Technical check', strength: 90, alternatives: ['Anxiety performance', 'Cry for validation'] },
    ],
    'gym': [
      { id: 1, carrier: 'Going to the gym', default: 'Health/fitness improvement', strength: 90, alternatives: ['Guilt management ritual', 'Social display', 'Procrastination from work'] },
      { id: 2, carrier: 'Personal trainer', default: 'Fitness expert helping you', strength: 85, alternatives: ['Paid friend who counts', 'Therapist with abs'] },
      { id: 3, carrier: 'Gym selfie', default: 'Documenting progress', strength: 75, alternatives: ['Proof of attendance', 'Vanity with plausible deniability'] },
    ],
    'dating apps': [
      { id: 1, carrier: '"Looking for something real"', default: 'Seeking genuine connection', strength: 90, alternatives: ['Exhaustion announcement', 'Preemptive blame shift'] },
      { id: 2, carrier: 'Profile photos', default: 'Authentic self-representation', strength: 70, alternatives: ['Historical fiction', 'Best 0.01% of existence'] },
      { id: 3, carrier: 'Swiping', default: 'Evaluating compatibility', strength: 85, alternatives: ['Sorting humans like spam', 'Dopamine farming'] },
    ]
  };

  const sampleCandidates = [
    {
      id: 1,
      text: '"You\'re on mute" is just a polite way of saying "we\'ve all been staring at you failing for 30 seconds."',
      operation: 'Exposure',
      violationType: 'Pragmatic',
      scores: { snap: 85, originality: 70, economy: 90, overall: 82 },
      mechanism: {
        default: '"You\'re on mute" → Helpful technical notification',
        twist: 'Exposes the hidden social meaning: public failure announcement',
        repairPath: 'Recognize that "helpful" masks collective witnessing of your fumble',
        twistWord: 'failing',
        benignness: 'Universal experience, self-inclusion'
      }
    },
    {
      id: 2,
      text: 'My camera is off because I\'m "having technical difficulties." The technical difficulty is that I\'m not wearing pants.',
      operation: 'Loading',
      violationType: 'Epistemic',
      scores: { snap: 75, originality: 60, economy: 70, overall: 68 },
      mechanism: {
        default: '"Technical difficulties" → Legitimate equipment problems',
        twist: 'Loads with actual meaning: deliberate concealment of unprofessionalism',
        repairPath: 'Recognize the euphemism everyone uses',
        twistWord: 'pants',
        benignness: 'Self-deprecating, universal pandemic experience'
      }
    },
    {
      id: 3,
      text: 'Video calls have taught me that "I\'ll let you go" actually means "I need to escape this conversation and you\'re going to thank me for it."',
      operation: 'Exposure',
      violationType: 'Pragmatic',
      scores: { snap: 80, originality: 65, economy: 60, overall: 68 },
      mechanism: {
        default: '"I\'ll let you go" → Polite end to conversation',
        twist: 'Exposes the inversion: speaker wants to leave, frames it as favor',
        repairPath: 'Recognize the social fiction we all participate in',
        twistWord: 'thank me',
        benignness: 'Observational, shared experience'
      }
    }
  ];

  const voices = [
    { id: 'deadpan', name: 'Deadpan', desc: 'Flat delivery, understated', icon: '😐', ops: { emptying: 70, compression: 80 } },
    { id: 'observational', name: 'Observational', desc: 'Shared recognition, "we all do this"', icon: '🔍', ops: { exposure: 80, loading: 60 } },
    { id: 'absurdist', name: 'Absurdist', desc: 'Logic pushed to extremes', icon: '🌀', ops: { categoryCrossing: 85, overliteralization: 70 } },
    { id: 'self_deprecating', name: 'Self-Deprecating', desc: 'Self as target', icon: '🙃', ops: { reversal: 75, exposure: 60 } },
    { id: 'sardonic', name: 'Sardonic', desc: 'Bitter but witty', icon: '😏', ops: { exposure: 70, reversal: 65 } },
    { id: 'whimsical', name: 'Whimsical', desc: 'Playful, light', icon: '✨', ops: { loading: 70, categoryCrossing: 60 } },
  ];

  const audiences = [
    { id: 'family', name: 'Family', taboo: 10, desc: 'All ages appropriate' },
    { id: 'general', name: 'General', taboo: 40, desc: 'Adult but clean' },
    { id: 'adult', name: 'Adult', taboo: 70, desc: 'Mature themes OK' },
    { id: 'edgy', name: 'Edgy', taboo: 90, desc: 'Few limits' },
  ];

  const handleGenerate = () => {
    if (topic.toLowerCase().includes('video') || topic.toLowerCase().includes('call') || topic.toLowerCase().includes('zoom')) {
      setShowBindings(true);
      setCandidates(sampleCandidates);
    } else if (sampleBindings[topic.toLowerCase()]) {
      setShowBindings(true);
      setCandidates([]);
    } else {
      setShowBindings(true);
      setCandidates([]);
    }
  };

  const toggleBinding = (id) => {
    setSelectedBindings(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const getBindingsForTopic = () => {
    const key = Object.keys(sampleBindings).find(k => topic.toLowerCase().includes(k));
    return key ? sampleBindings[key] : sampleBindings['video calls'];
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: '#e8e8e8',
      fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '32px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '24px'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 300, 
          margin: 0,
          letterSpacing: '0.05em',
          background: 'linear-gradient(90deg, #e8d5b7, #f0e6d3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          HUMOR LAB
        </h1>
        <p style={{ 
          color: '#8892a8', 
          marginTop: '8px',
          fontSize: '0.95rem',
          fontStyle: 'italic'
        }}>
          Understanding the mechanics of funny
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        marginBottom: '24px',
        background: 'rgba(0,0,0,0.2)',
        padding: '4px',
        borderRadius: '8px',
        width: 'fit-content'
      }}>
        {['generate', 'theory', 'library'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
              textTransform: 'capitalize',
              transition: 'all 0.2s',
              background: activeTab === tab ? 'rgba(232,213,183,0.15)' : 'transparent',
              color: activeTab === tab ? '#e8d5b7' : '#6b7280'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'generate' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
          {/* Left Panel - Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Topic Input */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <label style={{ 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                color: '#8892a8',
                display: 'block',
                marginBottom: '10px'
              }}>Topic / Seed</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="video calls, gym, dating apps..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#e8e8e8',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={handleGenerate}
                disabled={!topic}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: topic ? 'linear-gradient(135deg, #e8d5b7, #d4c4a8)' : 'rgba(255,255,255,0.1)',
                  color: topic ? '#1a1a2e' : '#6b7280',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: topic ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                Extract Bindings →
              </button>
            </div>

            {/* Voice Selection */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <label style={{ 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                color: '#8892a8',
                display: 'block',
                marginBottom: '12px'
              }}>Comedic Voice</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {voices.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setVoice(v.id)}
                    style={{
                      padding: '12px 10px',
                      borderRadius: '8px',
                      border: voice === v.id ? '2px solid #e8d5b7' : '1px solid rgba(255,255,255,0.1)',
                      background: voice === v.id ? 'rgba(232,213,183,0.1)' : 'rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{v.icon}</div>
                    <div style={{ color: '#e8e8e8', fontSize: '0.85rem', fontWeight: 500 }}>{v.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.7rem', marginTop: '2px' }}>{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <label style={{ 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                color: '#8892a8',
                display: 'block',
                marginBottom: '12px'
              }}>Audience</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {audiences.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAudience(a.id)}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      borderRadius: '6px',
                      border: audience === a.id ? '2px solid #e8d5b7' : '1px solid rgba(255,255,255,0.1)',
                      background: audience === a.id ? 'rgba(232,213,183,0.1)' : 'transparent',
                      color: audience === a.id ? '#e8d5b7' : '#8892a8',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 500
                    }}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Operation Sliders */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <label style={{ 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                color: '#8892a8',
                display: 'block',
                marginBottom: '16px'
              }}>Operation Weights</label>
              {Object.entries(operations).map(([op, val]) => (
                <div key={op} style={{ marginBottom: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                    fontSize: '0.8rem'
                  }}>
                    <span style={{ color: '#a0a8b8', textTransform: 'capitalize' }}>
                      {op.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span style={{ color: '#6b7280' }}>{val}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={val}
                    onChange={(e) => setOperations(prev => ({...prev, [op]: parseInt(e.target.value)}))}
                    style={{
                      width: '100%',
                      height: '4px',
                      borderRadius: '2px',
                      appearance: 'none',
                      background: `linear-gradient(to right, #e8d5b7 ${val}%, rgba(255,255,255,0.1) ${val}%)`,
                      cursor: 'pointer'
                    }}
                  />
                </div>
              ))}
              <button style={{
                width: '100%',
                marginTop: '8px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: '#6b7280',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}>
                🎲 Randomize
              </button>
            </div>

            {/* Style Dials */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <label style={{ 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                color: '#8892a8',
                display: 'block',
                marginBottom: '16px'
              }}>Style Dials</label>
              {[
                { key: 'violation', left: 'Gentle', right: 'Sharp' },
                { key: 'abstraction', left: 'Concrete', right: 'Abstract' },
                { key: 'verbosity', left: 'Terse', right: 'Elaborate' },
                { key: 'meta', left: 'Straight', right: 'Self-aware' },
                { key: 'darkness', left: 'Light', right: 'Dark' },
                { key: 'wordplay', left: 'Situational', right: 'Linguistic' },
              ].map(({ key, left, right }) => (
                <div key={key} style={{ marginBottom: '14px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    <span>{left}</span>
                    <span>{right}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={style[key]}
                    onChange={(e) => setStyle(prev => ({...prev, [key]: parseInt(e.target.value)}))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      appearance: 'none',
                      background: 'rgba(255,255,255,0.1)',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Bindings Panel */}
            {showBindings && (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#8892a8'
                  }}>Extracted Bindings</h3>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Click to target
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                  {getBindingsForTopic().map(binding => (
                    <div
                      key={binding.id}
                      onClick={() => toggleBinding(binding.id)}
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        border: selectedBindings.includes(binding.id) 
                          ? '2px solid #e8d5b7' 
                          : '1px solid rgba(255,255,255,0.08)',
                        background: selectedBindings.includes(binding.id)
                          ? 'rgba(232,213,183,0.08)'
                          : 'rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ 
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: '0.9rem',
                        color: '#e8d5b7',
                        marginBottom: '8px'
                      }}>
                        {binding.carrier}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#a0a8b8', marginBottom: '8px' }}>
                        → {binding.default}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '10px'
                      }}>
                        <div style={{
                          width: '60px',
                          height: '4px',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${binding.strength}%`,
                            height: '100%',
                            background: '#e8d5b7',
                            borderRadius: '2px'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                          {binding.strength}% strength
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        <span style={{ color: '#8892a8' }}>Alternatives:</span>
                        {binding.alternatives.map((alt, i) => (
                          <div key={i} style={{ marginLeft: '8px', marginTop: '2px' }}>• {alt}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedBindings.length > 0 && (
                  <button style={{
                    marginTop: '16px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #e8d5b7, #d4c4a8)',
                    color: '#1a1a2e',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    Generate from {selectedBindings.length} binding{selectedBindings.length > 1 ? 's' : ''} →
                  </button>
                )}
              </div>
            )}

            {/* Candidates */}
            {candidates.length > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <h3 style={{ 
                  margin: '0 0 20px 0', 
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#8892a8'
                }}>Generated Candidates</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {candidates.map(candidate => (
                    <div
                      key={candidate.id}
                      style={{
                        padding: '20px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.25)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <p style={{ 
                        fontSize: '1.1rem', 
                        lineHeight: 1.6,
                        margin: '0 0 16px 0',
                        color: '#f0f0f0'
                      }}>
                        "{candidate.text}"
                      </p>
                      
                      {/* Tags */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          background: 'rgba(232,213,183,0.15)',
                          color: '#e8d5b7',
                          fontSize: '0.75rem'
                        }}>
                          {candidate.operation}
                        </span>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          background: 'rgba(100,149,237,0.15)',
                          color: '#87CEEB',
                          fontSize: '0.75rem'
                        }}>
                          {candidate.violationType}
                        </span>
                      </div>

                      {/* Scores */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '16px', 
                        marginBottom: '16px',
                        fontSize: '0.8rem'
                      }}>
                        {Object.entries(candidate.scores).filter(([k]) => k !== 'overall').map(([key, val]) => (
                          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>{key}</span>
                            <div style={{
                              width: '50px',
                              height: '6px',
                              background: 'rgba(255,255,255,0.1)',
                              borderRadius: '3px'
                            }}>
                              <div style={{
                                width: `${val}%`,
                                height: '100%',
                                background: val > 75 ? '#90EE90' : val > 50 ? '#e8d5b7' : '#FFB6C1',
                                borderRadius: '3px'
                              }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Expandable Mechanism */}
                      <button
                        onClick={() => setExpandedCandidate(expandedCandidate === candidate.id ? null : candidate.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'transparent',
                          color: '#8892a8',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          marginBottom: expandedCandidate === candidate.id ? '16px' : '0'
                        }}
                      >
                        {expandedCandidate === candidate.id ? '▾' : '▸'} Mechanism
                      </button>

                      {expandedCandidate === candidate.id && (
                        <div style={{
                          padding: '16px',
                          borderRadius: '8px',
                          background: 'rgba(0,0,0,0.3)',
                          fontSize: '0.85rem',
                          lineHeight: 1.7
                        }}>
                          <div style={{ marginBottom: '12px' }}>
                            <span style={{ color: '#6b7280' }}>Default binding: </span>
                            <span style={{ color: '#a0a8b8' }}>{candidate.mechanism.default}</span>
                          </div>
                          <div style={{ marginBottom: '12px' }}>
                            <span style={{ color: '#6b7280' }}>Detachment: </span>
                            <span style={{ color: '#e8d5b7' }}>{candidate.mechanism.twist}</span>
                          </div>
                          <div style={{ marginBottom: '12px' }}>
                            <span style={{ color: '#6b7280' }}>Repair path: </span>
                            <span style={{ color: '#a0a8b8' }}>{candidate.mechanism.repairPath}</span>
                          </div>
                          <div style={{ marginBottom: '12px' }}>
                            <span style={{ color: '#6b7280' }}>Twist word: </span>
                            <span style={{ 
                              color: '#90EE90',
                              fontFamily: '"IBM Plex Mono", monospace'
                            }}>"{candidate.mechanism.twistWord}"</span>
                          </div>
                          <div>
                            <span style={{ color: '#6b7280' }}>Benignness: </span>
                            <span style={{ color: '#a0a8b8' }}>{candidate.mechanism.benignness}</span>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '8px', 
                        marginTop: '16px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        paddingTop: '16px'
                      }}>
                        <button style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'rgba(144,238,144,0.2)',
                          color: '#90EE90',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}>👍</button>
                        <button style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'rgba(255,182,193,0.2)',
                          color: '#FFB6C1',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}>👎</button>
                        <button style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'transparent',
                          color: '#8892a8',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}>✏️ Edit</button>
                        <button style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'transparent',
                          color: '#8892a8',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}>🔄 Variations</button>
                        <button style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'transparent',
                          color: '#8892a8',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}>💾 Save</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Panel (shows when 👎 would be clicked) */}
            {candidates.length > 0 && (
              <div style={{
                background: 'rgba(255,200,100,0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255,200,100,0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.2rem' }}>💡</span>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '0.95rem',
                    color: '#e8d5b7'
                  }}>Learning Moment</h3>
                </div>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#a0a8b8',
                  lineHeight: 1.7,
                  margin: '0 0 16px 0'
                }}>
                  Candidate #2 scored lower on <strong style={{ color: '#e8d5b7' }}>economy</strong>. 
                  The setup ("having technical difficulties") is explained rather than implied, which 
                  reduces the snap. The audience should discover the euphemism, not be told it exists.
                </p>
                <div style={{ 
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: '#8892a8',
                  marginBottom: '16px'
                }}>
                  <strong style={{ color: '#e8d5b7' }}>Principle:</strong> Trust the audience. 
                  Don't explain the mechanism—let them experience the repair.
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'rgba(232,213,183,0.2)',
                    color: '#e8d5b7',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}>Try tighter version</button>
                  <button style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'transparent',
                    color: '#6b7280',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}>See theory: Economy</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'theory' && (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          padding: '40px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <h2 style={{ 
            color: '#e8d5b7', 
            marginTop: 0,
            fontWeight: 400,
            fontSize: '1.5rem'
          }}>The Mechanics of Funny</h2>
          <p style={{ color: '#a0a8b8', lineHeight: 1.8 }}>
            Humor arises when you form a strong default interpretation, then experience a 
            controlled detachment that violates that interpretation—but can be quickly 
            repaired into a coherent alternative.
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '16px',
            marginTop: '24px'
          }}>
            {[
              { title: 'Setup', desc: 'Build strong default binding' },
              { title: 'Twist', desc: 'Detach via operation' },
              { title: 'Repair', desc: 'Find coherent alternative' },
              { title: 'Payoff', desc: 'Surplus from snap' }
            ].map(stage => (
              <div key={stage.title} style={{
                padding: '20px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <h4 style={{ color: '#e8d5b7', margin: '0 0 8px 0', fontSize: '1rem' }}>
                  {stage.title}
                </h4>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
          <button style={{
            marginTop: '24px',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid rgba(232,213,183,0.3)',
            background: 'transparent',
            color: '#e8d5b7',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}>
            Read full theory →
          </button>
        </div>
      )}

      {activeTab === 'library' && (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '60px 40px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
          <h2 style={{ color: '#e8d5b7', fontWeight: 400 }}>Your Library</h2>
          <p style={{ color: '#6b7280' }}>
            Saved jokes, successful patterns, and learning notes will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default HumorLab;
