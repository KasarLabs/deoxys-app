import { motion } from 'framer-motion';
import _ from 'lodash';
import { ReactNode, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { selectRunningApps } from 'renderer/features/appsSlice';
import {
  deleteNode,
  selectIsRunning,
  setSetupComplete,
  startNode,
  stopNode,
} from 'renderer/features/nodeSlice';
import { showSnackbar } from 'renderer/store/snackbar';
import { useAppDispatch, useAppSelector } from 'renderer/utils/hooks';
import { styled } from 'styled-components';
import Spinner from 'renderer/components/Spinner';
// import DeoxysLogo from '../../../assets/deoxys-logo.jpg';
import DeoxysLogo from '../../../assets/GradientFullBlack.png';
import APPS_CONFIG from '../../../config/apps';
import Docs from './Docs';
import Logs from './Logs';
import Telemetry from './Telemetry';
import TwitterIcon from '../../../assets/twitter.png';
import AppViewer from './AppViewer';
import RPC from './Rpc';
// import DeoxysLogo from 'renderer/components/DeoxysLogo';

const NavbarContainer = styled(motion.div)`
  background-color: #fff;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const Navbar = styled(motion.div)`
  background-color: #fff;
  height: 100%;
  width: 18%;
  display: flex;
  flex-direction: column;
  padding-left: 0.8rem;
  padding-right: 0.8rem;
`;

const ContentContainer = styled.div`
  background-color: black;
  width: 82%;
  height: 100%;
  position: relative;
`;

const NavbarHeading = styled.div`
  color: black;
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const NavbarHeadingLogo = styled.img`
  width: 250px;
  height: auto;
  @media (max-width: 1500px) {
    width: 200px;
  }
  @media (max-width: 1200px) {
    width: 150px;
  }
  @media (max-width: 800px) {
    width: 100px;
  }
`;

const NavbarItemsContainer = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  padding-bottom: 1.5rem;
  height: -webkit-fill-available;
`;

const NavbarItem = styled.div<{ active: boolean }>`
  background-color: ${(props) => (props.active ? '#000' : 'transparent')};
  color: ${(props) => (props.active ? '#FFF' : '#000')};
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 0.8rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1.2em;
`;

const NavbarImage = styled.img`
  width: 1.2rem;
  border-radius: 50%;
  margin-right: 0.4rem;
`;

const AppSeperator = styled.hr`
  border: 0.2px solid #282828;
  width: 100%;
`;

type NavbarItemType = {
  id: string;
  name: string;
  path: string;
  component: ReactNode;
};
const NAVBAR_ITEMS: NavbarItemType[] = [
  {
    id: '85c147bd-32c6-433b-97f2-009167aab78b',
    name: '🔍 Logs',
    path: 'logs',
    component: <Logs />,
  },
  {
    id: '7792b715-771b-47c2-a5c8-3c15cae16a3d',
    name: '📊 Telemetry',
    path: 'telemetery',
    component: <Telemetry />,
  },
  {
    id: 'fa1d9821-6fd4-46de-99ea-0f0fc967780c',
    name: '📃 Docs',
    path: 'docs',
    component: <Docs />,
  },
  {
    id: 'fa1d9821-6fd4-46de-99ea-0f0fc967780d',
    name: '🌐 RPC',
    path: 'rpc',
    component: <RPC />,
  },
];

export default function Navigtion() {
  const [navbarActiveId, setNavbarActiveId] = useState<string>(
    NAVBAR_ITEMS[0].id
  );
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isNodeRunning = useAppSelector(selectIsRunning);
  const runningApps = useAppSelector(selectRunningApps);

  const handleScreenshot = async () => {
    try {
      setShowSpinner(true);
      console.log('window.electron.ipcRenderer', window.electron.ipcRenderer);
      console.log('madara', window.electron.ipcRenderer.madara);
      await window.electron.ipcRenderer.madara.sendTweet();
      setShowSpinner(false);
    } catch (err) {
      dispatch(showSnackbar());
      setShowSpinner(false);
    }
  };

  return (
    <NavbarContainer>
      <Navbar
        initial={{ x: '-150%' }}
        animate={{ x: 0, transition: { type: 'tween', duration: 0.5 } }}
      >
        <NavbarHeading>
          <NavbarHeadingLogo src={DeoxysLogo} />
        </NavbarHeading>
        {/* <DeoxysLogo width="500px" height="50px" /> */}
        <NavbarItemsContainer>
          {NAVBAR_ITEMS.map((item) => (
            <NavbarItem
              onClick={() => {
                navigate(`./${item.path}`);
                setNavbarActiveId(item.id);
              }}
              active={navbarActiveId === item.id}
            >
              {item.name}
            </NavbarItem>
          ))}
          {!_.isEmpty(runningApps) && <AppSeperator />}
          {Object.entries(runningApps)
            .filter(([, isRunning]) => isRunning)
            .map(([appId]) => {
              const app = APPS_CONFIG.apps.filter((a) => a.id === appId)[0];
              if (!app.showFrontend) {
                return <div />;
              }
              return (
                <NavbarItem
                  onClick={() => {
                    navigate(`./apps/${appId}`);
                    setNavbarActiveId(appId);
                  }}
                  active={navbarActiveId === appId}
                >
                  <NavbarImage src={app.logoUrl} />
                  {app.appName}
                </NavbarItem>
              );
            })}
          <NavbarItem
            style={{ display: 'flex', marginTop: 'auto' }}
            onClick={() => handleScreenshot()}
            active={false}
          >
            {showSpinner ? (
              <Spinner />
            ) : (
              <img
                src={TwitterIcon}
                width={16}
                height={16}
                alt="twitter icon"
                style={{ marginRight: 10 }}
              />
            )}
            <div>Did you tweet?</div>
          </NavbarItem>
          {isNodeRunning ? (
            <NavbarItem
              onClick={() => {
                dispatch(stopNode());
              }}
              active={false}
            >
              🔌 Stop Node
            </NavbarItem>
          ) : (
            <NavbarItem
              onClick={() => {
                dispatch(startNode());
              }}
              active={false}
            >
              ▶️ Resume Node
            </NavbarItem>
          )}
          <NavbarItem
            onClick={() => {
              dispatch(deleteNode());
              dispatch(setSetupComplete(false));
              navigate('/');
            }}
            active={false}
          >
            🗑️ Delete node
          </NavbarItem>
        </NavbarItemsContainer>
      </Navbar>
      <ContentContainer>
        <Routes>
          {NAVBAR_ITEMS.map((item) => (
            <Route path={`/${item.path}/*`} element={item.component} />
          ))}
          <Route path="/apps/:appId" element={<AppViewer />} />
        </Routes>
      </ContentContainer>
    </NavbarContainer>
  );
}
