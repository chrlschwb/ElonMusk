import { useEffect, useState } from 'react';
import Head from '~/components/shared/Head';
import logo from '~/components/shared/Logo/logo.jpg';
import Modal from '~/components/shared/Modal';
import { AuthStatus } from '~/components/auth';
import axios from 'axios';

var prompt: string = '';

export default function HomeScreen() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<boolean>(false);

  const generateImage = async () => {
    setLoadingState(true);
    setErrorState(false);
    await axios
      .post(`/generator`, { prompt })
      .then(({ data }) => {
        setImageUrl(data);
      })
      .catch((err) => {
        console.log(err);
        setErrorState(true);
      });

    setLoadingState(false);
    console.log('finish generator');
  };

  useEffect(() => {
    axios(`/authenticate`, {
      withCredentials: true,
    })
      .then(({ data }) => {
        const { iat, ...authData } = data; // remove unimportant iat value
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Head title="Home" />
      <div className="">
        <div className="hero-overlay bg-opacity-60">
          <div className="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
            <div
              id="profile"
              className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0"
            >
              <div className="p-4 md:p-12 text-center lg:text-left">
                <div className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"></div>
                <h1 className="text-3xl font-bold pt-8 lg:pt-0">Our Mask</h1>
                <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
                <p className="pt-8 text-sm">
                  Totally optional short description about your idea, what you do and so on.
                </p>
                <input
                  type="text"
                  className="mt-5 input input-bordered w-full max-w-xs"
                  onChange={(e) => (prompt = e.target.value)}
                />
                <div className="pt-12 pb-8">
                  <label
                    htmlFor="my-modal-6"
                    className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full"
                    onClick={generateImage}
                  >
                    Generater Image
                  </label>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-2/5">
              <img
                src={logo}
                className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
                style={{ height: '480px' }}
              />
            </div>
            <div className="absolute top-0 right-0 h-12 w-18 p-4">
              <AuthStatus />
            </div>
          </div>
        </div>
      </div>
      <Modal title={prompt} state={loadingState} url={imageUrl} error={errorState} />
    </>
  );
}
