import React, { useState } from 'react';
import { styled } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { Progress } from 'electron-dl';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Progress } from 'electron-dl';
import {
  AnimatePresence,
  motion,
  useAnimate,
  useAnimation,
} from 'framer-motion';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Settings from 'renderer/components/Settings';
import {
  selectConfig,
  setConfig,
  startNode,
} from 'renderer/features/nodeSlice';
import Settings from 'renderer/components/Settings';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'renderer/utils/hooks';
import InfiniteBarLoader from '../components/InfiniteBarLoader';
import Button from '../components/Button';
import Input from '../components/Input';
import animationGif from '../../../assets/deoxys-full.gif';
import deoxysAuthority from '../../../assets/deoxys-authority.gif';
import deoxysLight from '../../../assets/deoxys-light.gif';
import { useAppDispatch } from 'renderer/utils/hooks';
import { styled } from 'styled-components';
import Button from '../components/Button';
import InfiniteBarLoader from '../components/InfiniteBarLoader';
import Input from '../components/Input';
import SharinganEye from '../components/SharinganEye';
import useErrorBoundaryMain from 'renderer/hooks/useErrorBoundaryMain';

const LandingContainer = styled(motion.div)`
  background-color: black;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeadingRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  padding-right: 3rem;
  padding-top: 1rem;
`;

const FormContainer = styled(motion.form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InfiniteLoaderContainer = styled(motion.div)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const InfiniteLoaderText = styled.div`
  color: white;
  margin-top: 1rem;
`;

const convertBytesToMegabytes = (bytes: number): number => {
  // convert bytes to megabytes and round to 2 decimal places
  return Math.round((bytes / 1024 / 1024) * 100) / 100;
};


export default function Landing() {
  const formAnimationControl = useAnimation();
  const loaderAnimationControl = useAnimation();
  const brightnessOneControl = useAnimation();
  const brightnessTwoControl = useAnimation();
  const [bytesDownloaded, setBytesDownlaoded] = useState<number>(0);
  const [percentageDownloaded, setPercentageDownloaded] = useState<
    number | undefined
  >(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const nodeConfig = useSelector(selectConfig);
  const dispatch = useAppDispatch();

  const [launchMode, setLaunchMode] = useState(0);
  const [showButtons, setShowButtons] = useState(true);
  const [animationSource, setAnimationSource] = useState(deoxysAuthority);
  const [deoxysSize, setDeoxysSize] = useState('400px');

  window.electron.ipcRenderer.madara.onDownloadProgress(
    (event: any, progress: Progress) => {
      if (progress.percent !== 0) {
        setPercentageDownloaded(progress.percent * 100);
      }
      setBytesDownlaoded(progress.transferredBytes);
    }
    );
    
    const navigate = useNavigate();
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeConfig.name) {
      return;
    }

    // remove the form
    formAnimationControl.start({
      opacity: [1, 0],
      transition: { duration: 1 },
    });

    // remove the white spots from the eye
    brightnessOneControl.start({
      opacity: 0,
      transition: { duration: 1 },
    });
    brightnessTwoControl.start({
      opacity: 0,
      transition: { duration: 1 },
    });

    // make the height of the form 0 so that the spacing between the loader and the eye is correct
    formAnimationControl.start({
      height: 0,
      transition: { delay: 1, duration: 1 },
    });

    // show the loader for downlaing
    const releaseExists =
      await window.electron.ipcRenderer.madara.releaseExists(nodeConfig);
    if (!releaseExists) {
      loaderAnimationControl.start({
        opacity: [0, 1],
        transition: { duration: 1, delay: 1 },
      });
    }

    setShowButtons(false);

    // wait for 1 second
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    dispatch(startNode());
    navigate('/navigation/logs');
  };

  const handleNameChange = (e: any) => {
    dispatch(
      setConfig({
        ...nodeConfig,
        name: e.target.value,
        mode: launchMode,
      })
    );
  };

  useErrorBoundaryMain();

  return (
    <LandingContainer
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key="landing_container"
    >
      <AnimatePresence>
        {isSettingsOpen && (
          <Settings onClose={() => setIsSettingsOpen(false)} />
        )}
      </AnimatePresence>
      <HeadingRow>
        <FontAwesomeIcon
          icon={faSliders}
          color="white"
          size="xl"
          style={{ opacity: '70%', cursor: 'pointer' }}
          onClick={() => setIsSettingsOpen(true)}
        />
      </HeadingRow>
      <div>
        <img
          src={animationSource}
          alt="Animation"
          style={{ width: deoxysSize, height: 'auto', padding: '50px' }}
        />
      </div>
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem',
          width: '40%',
          opacity: showButtons ? 1 : 0, // Contrôler l'opacité en fonction de l'état showButtons
        }}
        animate={showButtons ? 'visible' : 'hidden'} // Animer l'opacité
        variants={{
          visible: { opacity: 1 },
          hidden: {
            opacity: 0,
            transition: { duration: 1 },
          },
        }}
      >
        <Button
          verticalPadding="0.7rem"
          text="Authority"
          style={{
            fontSize: '1rem',
            width: '100%',
            textAlign: 'center',
            marginRight: '1rem',
            backgroundColor:
              launchMode === 0
                ? 'rgba(255, 159, 64, 0.5)'
                : 'rgba(255, 159, 64, 0.17)',
          }}
          onClick={() => {
            setLaunchMode(0);
            setAnimationSource(deoxysAuthority);
            setDeoxysSize('430px');
          }}
        />
        <Button
          verticalPadding="0.7rem"
          text="Full"
          style={{
            fontSize: '1rem',
            width: '100%',
            textAlign: 'center',
            marginRight: '1rem',
            backgroundColor:
              launchMode === 1
                ? 'rgba(255, 159, 64, 0.5)'
                : 'rgba(255, 159, 64, 0.17)',
          }}
          onClick={() => {
            setLaunchMode(1);
            setAnimationSource(animationGif);
            setDeoxysSize('700px');
          }}
        />
        <Button
          verticalPadding="0.7rem"
          text="Light"
          style={{
            fontSize: '1rem',
            width: '100%',
            textAlign: 'center',
            backgroundColor:
              launchMode === 2
                ? 'rgba(255, 159, 64, 0.5)'
                : 'rgba(255, 159, 64, 0.17)',
          }}
          onClick={() => {
            setLaunchMode(2);
            setAnimationSource(deoxysLight);
            setDeoxysSize('500px');
          }}
        />
      </motion.div>
      <FormContainer onSubmit={handleFormSubmit} animate={formAnimationControl}>
        <Input
          placeholder="What name shall you be known by in this realm?"
          style={{
            fontSize: '1rem',
            width: '40%',
            textAlign: 'center',
          }}
          onChange={handleNameChange}
          value={nodeConfig.name}
        />
        <Button
          verticalPadding="0.7rem"
          text="Wake up to reality"
          style={{
            fontSize: '1rem',
            width: '40%',
            textAlign: 'center',
            marginTop: '1rem',
          }}
          onClick={handleFormSubmit}
        />
      </FormContainer>
      <InfiniteLoaderContainer
        initial={{ opacity: 0 }}
        animate={loaderAnimationControl}
      >
        <InfiniteBarLoader />
        <InfiniteLoaderText>
          Downloading{' '}
          {percentageDownloaded !== undefined
            ? `${percentageDownloaded.toFixed(2)}%`
            : `${convertBytesToMegabytes(bytesDownloaded)} MB`}
        </InfiniteLoaderText>
      </InfiniteLoaderContainer>
    </LandingContainer>
  );
}
