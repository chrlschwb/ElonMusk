/* global VoidFunction, JSX */
import { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate, useLocation, Navigate, Location } from 'react-router-dom';
import { fakeAuthProvider } from '~/components/auth/provider';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import axios from 'axios';

import imgLogo from '~/assets/img/logo.jpg';

interface AuthContextType {
  user: any;
  signin: (user: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);

  const signin = (newUser: string, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  const signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };

  const value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

var buf: string;
function AuthStatus() {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const login = async () => {
    //disconnects the web3 provider if it's already active
    if (isConnected) {
      await disconnectAsync();
    }
    // enabling the web3 provider metamask
    const { account, chain } = await connectAsync({
      connector: new InjectedConnector(),
    });

    const userData = { address: account, chain: chain.id, network: 'evm' };
    // making a post request to our 'request-message' endpoint
    const { data } = await axios.post(`/request-message`, userData, {
      headers: {
        'content-type': 'application/json',
      },
    });
    const message = data.message;
    // signing the received message via metamask
    const signature = await signMessageAsync({ message });

    await axios.post(
      `/verify`,
      {
        message,
        signature,
      },
      { withCredentials: true } // set cookie from Express server
    );

    await axios(`/authenticate`, {
      withCredentials: true,
    })
      .then(({ data }) => {
        const { iat, ...authData } = data; // remove unimportant iat value
        buf = authData.address;
      })
      .catch((err) => {
        console.log(err);
      });

    auth.signin(buf, () => {
      // Sends the user back to the page he tried to visit
      // when he was redirected to the login page.
      navigate('/');
    });
  };

  const logout = async () => {
    await axios(`/logout`, {
      withCredentials: true,
    });
    auth.signout(() => {
      // Sends the user back to the page he tried to visit
      // when he was redirected to the login page.
      navigate('/');
    });
  };

  const auth = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="bg-orange-900 rounded-full border-2 border-solid">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={imgLogo} alt="Workflow logo" />
          </div>

          <div
            className=" font-mono text-4xl hidden sm:block text-white"
            style={{ fontFamily: 'designer', textShadow: '2px 2px 4px black' }}
          >
            Elon Musk Meme NFT Generator
          </div>

          {/* Media query starts from MD breakpoint */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Check if auth.user has truthy value */}
            {auth.user && (
              <p className="text-white">
                Welcome{' '}
                <span className="text-lime-500">
                  {String(auth.user).slice(0, 5)} ... {String(auth.user).slice(38, 42)}
                </span>{' '}
              </p>
            )}

            {/* Connect/Disconnect button based on auth state */}
            {!auth.user ? (
              <button className="btn btn-secondary" onClick={login}>
                Connect MetaMask
              </button>
            ) : (
              <button
                className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={logout}
              >
                Disconnect MetaMask
              </button>
            )}
          </div>

          {/* Menu button for mobile device */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="bg-orange-900 rounded-full p-2 inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-800 focus:outline-none focus:ring-2 focus-ring-offset-2 focus:ring-offset-orange-900 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden" id="mobile-menu">
        {auth.user && (
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-2 space-y-1 sm:px-3">
              <p className="text-white">
                Welcome{' '}
                <span className="text-lime-500">
                  {String(auth.user).slice(0, 5)} ... {String(auth.user).slice(38, 42)}
                </span>{' '}
              </p>
            </div>
            <div className="mt-3 px-2 space-y-1 sm:px-3">
              <button
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={logout}
              >
                Disconnect MetaMask
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

type RequireAuthProps = {
  children: JSX.Element;
};

function RequireAuth({ children }: RequireAuthProps) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    // Redirect to the /login page, but save the current location.
    // This allows us to send user along to that page after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export { AuthProvider, AuthStatus, RequireAuth, useAuth };
