import React, { useState, useEffect } from 'react';
import cutegif from '../src/assets/images/cutegif.gif';
import bg from '../src/assets/images/Desktop - 1.png';
import sadgif from '../src/assets/images/no.gif';
import imageyess from '../src/assets/images/yes.gif';
import { FiPlusCircle, FiEdit2, FiSave } from "react-icons/fi";
import cutepanda from '../src/assets/images/cutepanda.gif';
import yespanda from '../src/assets/images/yespanda.gif';
import pandano from '../src/assets/images/pandano.gif';

const App = () => {
  const [imageSrc, setImageSrc] = useState(cutegif);
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'normal');
  const [isEditing, setIsEditing] = useState(false);
  const [customSettings, setCustomSettings] = useState(
    JSON.parse(localStorage.getItem('customSettings')) || {
      defaultImage: cutegif,
      yesImage: imageyess,
      noImage: sadgif,
      question: 'Do you want to go out with me?',
      yesMessage: 'I knew you would say yes!',
      noMessage: "Don't run away from me!"
    }
  );

  const images = {
    normal: {
      default: cutegif,
      yes: imageyess,
      no: sadgif,
      question: 'Do you want to go out with me?',
      yesMessage: 'I knew you would say yes!',
      noMessage: "Don't run away from me!"
    },
    panda: {
      default: cutepanda,
      yes: yespanda,
      no: pandano,
      question: 'Panda wants to know: Will you go out with me?',
      yesMessage: 'Panda is so happy you said yes!',
      noMessage: "Panda is sad you said no :("
    },
    custom: {
      default: customSettings.defaultImage,
      yes: customSettings.yesImage,
      no: customSettings.noImage,
      question: customSettings.question,
      yesMessage: customSettings.yesMessage,
      noMessage: customSettings.noMessage
    }
  };

  const yes = () => {
    setImageSrc(images[mode].yes);
    setMessage(images[mode].yesMessage); 
  };

  const handleNoHover = (e) => {
    if (noHoverCount < 3) {
      const button = e.target;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const buttonWidth = button.offsetWidth;
      const buttonHeight = button.offsetHeight;

      const maxX = viewportWidth - buttonWidth;
      const maxY = viewportHeight - buttonHeight;
      
      const randomX = Math.floor(Math.random() * maxX);
      const randomY = Math.floor(Math.random() * maxY);
      
      button.style.position = 'fixed';
      button.style.left = `${randomX}px`;
      button.style.top = `${randomY}px`;
      
      setNoHoverCount(prev => prev + 1);
    }
  };

  const handleNoClick = () => {
    if (noHoverCount >= 3) {
      setImageSrc(images[mode].no);
    }
    setMessage(images[mode].noMessage);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
    setIsEditing(false);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('mode', newMode);
    setImageSrc(images[newMode].default);
    setShowOptions(false);
    setMessage('');
    setNoHoverCount(0);
  };

  const handleCustomSettingChange = (e, field) => {
    setCustomSettings({
      ...customSettings,
      [field]: e.target.value
    });
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomSettings({
          ...customSettings,
          [field]: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCustomSettings = () => {
    localStorage.setItem('customSettings', JSON.stringify(customSettings));
    if (mode === 'custom') {
      setImageSrc(customSettings.defaultImage);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    setImageSrc(images[mode].default);
  }, [mode, customSettings]);

  return (
    <div className='w-full' style={{ 
      backgroundImage: `url(${bg})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh'
    }}>
      <div className="flex justify-center items-center h-screen flex-col relative">
        <div className="absolute top-10 right-10 flex gap-4">
          <button 
            onClick={() => mode === 'custom' && setIsEditing(!isEditing)}
            className={`p-2 rounded-full ${mode === 'custom' ? 'bg-blue-100 text-blue-600' : 'hidden'}`}
          >
            {isEditing ? <FiSave size={20} /> : <FiEdit2 size={20} />}
          </button>
          <FiPlusCircle 
            size={30} 
            className='text-red-600 cursor-pointer' 
            onClick={toggleOptions}
          />
        </div>

        {showOptions && (
          <div className="absolute top-20 right-10 bg-white p-4 rounded-lg shadow-lg z-10 w-64">
            <p className="font-bold mb-2">Select Mode:</p>
            <button 
              onClick={() => changeMode('normal')} 
              className={`block w-full text-left p-2 mb-1 rounded ${mode === 'normal' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            >
              Normal Mode
            </button>
            <button 
              onClick={() => changeMode('panda')} 
              className={`block w-full text-left p-2 mb-1 rounded ${mode === 'panda' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            >
              Panda Mode
            </button>
            <button 
              onClick={() => changeMode('custom')} 
              className={`block w-full text-left p-2 rounded ${mode === 'custom' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            >
              Custom Mode
            </button>
          </div>
        )}

        {isEditing && mode === 'custom' && (
          <div className="absolute top-20 left-10 bg-white p-4 rounded-lg shadow-lg z-10 w-80">
            <h3 className="font-bold mb-3">Customize Your Mode</h3>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Question Text:</label>
              <input
                type="text"
                value={customSettings.question}
                onChange={(e) => handleCustomSettingChange(e, 'question')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Default Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'defaultImage')}
                className="w-full p-1 border rounded"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Yes Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'yesImage')}
                className="w-full p-1 border rounded"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">No Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'noImage')}
                className="w-full p-1 border rounded"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Yes Response:</label>
              <input
                type="text"
                value={customSettings.yesMessage}
                onChange={(e) => handleCustomSettingChange(e, 'yesMessage')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">No Response:</label>
              <input
                type="text"
                value={customSettings.noMessage}
                onChange={(e) => handleCustomSettingChange(e, 'noMessage')}
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              onClick={saveCustomSettings}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Save Settings
            </button>
          </div>
        )}

<h1 className='text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-red-700 mt-4 sm:mt-6 md:mt-8 lg:mt-10 uppercase'>
  {images[mode].question}
</h1>
<img src={imageSrc} alt="Mode display" className='w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64' />
        
        {message && <p className="lg:text-xl  sm:text-sm font-bold text-blue-500 mt-5">{message}</p>}
      
        <div className="actions lg:flex-row md:flex-col sm:flex-col mt-10 relative">
          <button onClick={yes} className='border px-5 py-2 text-xl uppercase m-2 rounded-lg bg-[#E0A5B0] text-white hover:bg-[#C07B8A]'>
            yes
          </button>
          <button 
            onMouseEnter={handleNoHover}
            onClick={handleNoClick}
            className='border px-5 py-2 m-2 text-xl uppercase rounded-lg bg-[#A070A0] text-white hover:bg-[#8A5A8A] relative'
          >
            no
          </button> 
        </div>
      </div>
    </div>
  );
};

export default App;