import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Progress } from 'electron-dl';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Settings from 'renderer/components/Settings';
import {
  selectConfig,
  setConfig,
  startNode,
} from 'renderer/features/nodeSlice';
import { useAppDispatch } from 'renderer/utils/hooks';
import InfiniteBarLoader from '../components/InfiniteBarLoader';
import Button from '../components/Button';
import Input from '../components/Input';
import { styled } from 'styled-components';
import useErrorBoundaryMain from 'renderer/hooks/useErrorBoundaryMain';

const LandingContainer = styled(motion.div)`
  background-color: #fff;
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
  const [launchMode, setLaunchMode] = useState(0);
  const [showButtons, setShowButtons] = useState(true);
  const [DeoxysAuthorithy, setDeoxysAuthority] = useState(
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/05949c12-fc36-4a70-ad23-24873471fe60/dcr7i20-626a1a82-a3ab-4433-944d-8acc4a4449a3.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzA1OTQ5YzEyLWZjMzYtNGE3MC1hZDIzLTI0ODczNDcxZmU2MFwvZGNyN2kyMC02MjZhMWE4Mi1hM2FiLTQ0MzMtOTQ0ZC04YWNjNGE0NDQ5YTMuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.tLOS6q-5axaUtRhnRyD8sH8W2f2Snzc9EzBxMOL9USc'
  );
  const [DeoxysFull, setDeoxysFull] = useState(
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/05949c12-fc36-4a70-ad23-24873471fe60/dcr7hk2-6ae83044-3ca0-49be-b577-bdf48c95e359.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzA1OTQ5YzEyLWZjMzYtNGE3MC1hZDIzLTI0ODczNDcxZmU2MFwvZGNyN2hrMi02YWU4MzA0NC0zY2EwLTQ5YmUtYjU3Ny1iZGY0OGM5NWUzNTkuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.j8qJmUEtMwcx-UaXhJ_QY-6uaESAal5BJAITQZbXKn8'
  );
  const [DeoxysLight, setDeoxyslight] = useState(
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/05949c12-fc36-4a70-ad23-24873471fe60/dcr7i99-354d57f4-a70a-4d20-b387-cd0af17e66fe.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzA1OTQ5YzEyLWZjMzYtNGE3MC1hZDIzLTI0ODczNDcxZmU2MFwvZGNyN2k5OS0zNTRkNTdmNC1hNzBhLTRkMjAtYjM4Ny1jZDBhZjE3ZTY2ZmUuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.NlaeZaj86DXvHDDU-SqIpRLOXF0EczR02ide_8ig5uQ'
  );
  const [animationSource, setAnimationSource] = useState(DeoxysAuthorithy);
  const [deoxysSize, setDeoxysSize] = useState('400px');
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
  const navigate = useNavigate();

  window.electron.ipcRenderer.madara.onDownloadProgress(
    (event: any, progress: Progress) => {
      if (progress.percent !== 0) {
        setPercentageDownloaded(progress.percent * 100);
      }
      setBytesDownlaoded(progress.transferredBytes);
    }
  );

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

    await window.electron.ipcRenderer.madara.setup(nodeConfig);

    if (!releaseExists) {
      await loaderAnimationControl.start({ opacity: [1, 0] });
    }

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
          color="black"
          size="xl"
          style={{ cursor: 'pointer' }}
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
          text="Archive"
          style={{
            fontSize: '1rem',
            width: '100%',
            textAlign: 'center',
            marginRight: '1rem',
            backgroundColor: launchMode === 0 ? '#000' : '#FFF',
            color: launchMode === 0 ? '#FFF' : '#000',
          }}
          onClick={() => {
            setLaunchMode(0);
            setAnimationSource(DeoxysAuthorithy);
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
            backgroundColor: launchMode === 1 ? '#000' : '#FFF',
            color: launchMode === 1 ? '#FfF' : '#000',
          }}
          onClick={() => {
            setLaunchMode(1);
            setAnimationSource(DeoxysFull);
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
            backgroundColor: launchMode === 2 ? '#000' : '#FFF',
            color: launchMode === 2 ? '#FFF' : '#000',
          }}
          onClick={() => {
            setLaunchMode(2);
            setAnimationSource(DeoxysLight);
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
          text="Start"
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
