/* global VoidFunction, JSX */
import { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate, useLocation, Navigate, Location } from 'react-router-dom';
import { fakeAuthProvider } from '~/components/auth/provider';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import axios from 'axios';

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

  if (!auth.user) {
    return (
      <button className="btn btn-secondary" onClick={login}>
        Connect MetaMask
      </button>
    );
  }

  return (
    <p className="text-white">
      Welcome{' '}
      <span className="text-lime-500">
        {String(auth.user).slice(0, 5)} ... {String(auth.user).slice(38, 42)}
      </span>{' '}
      <button
        className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        onClick={logout}
      >
        Disconnect MetaMask
      </button>
    </p>
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
