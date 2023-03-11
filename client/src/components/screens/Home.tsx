import { useEffect, useState } from 'react';
import Head from '~/components/shared/Head';
import imgTicket from '~/assets/img/3.png';
import Modal from '~/components/shared/Modal';
import { AuthStatus } from '~/components/auth';
import axios from 'axios';

import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Panel from '../shared/Panel';
import FooterBar from '../shared/Footerbar';
import { imageData } from './Image';

const sliderSettings: Settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  initialSlide: 0,
  autoplay: true,

  responsive: [
    {
      breakpoint: 1524,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 1324,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
        infinite: false,
        dots: false,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: false,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};

var prompt: string = '';

export default function HomeScreen() {
  const [imageUrl, setImageUrl] = useState<string>('');

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [index, setIndex] = useState(0);

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
      <div className="main_background ">
        <div className="hero-overlay bg-opacity-30 pt-32 bg-slate-600">
          <div className="bg-slate-800 pt-5 pb-5 border-t-2 border-orange-300 border-b-2">
            <Slider {...sliderSettings} className="opacity-80">
              {imageData.map((imageSrc, index) => (
                <div key={index}>
                  <Panel url={imageSrc} key={index} />
                </div>
              ))}
            </Slider>
          </div>
          <div className="absolute -mt-24 h-32 pl-32">
            <img src={imgTicket} alt="ticket image" className="h-56" />
          </div>
          <div className="mt-32 flex items-center h-32 mx-auto text-white bg-slate-400 space-y-4">
            <div className="flex justify-between items-center w-full">
              <label
                htmlFor="inputField"
                className="mr-2 ml-4 text-gray-700 font-medium absolute 
              border-r-2 border-r-gray-900 h-16 flex justify-between items-center"
              >
                Elon Musk:
              </label>
              <textarea
                id="inputField"
                className="border rounded-md p-2 ml-3 focus:outline-none focus:ring-2 
                focus:ring-blue-600 w-full text-black border-stone-900 resize-none pl-24"
                placeholder="Enter your text here"
                onChange={(e) => (prompt = 'Elon Musk ' + e.target.value)}
              />
              <label
                className="bg-blue-600 hover:bg-blue-700 rounded-md  text-white px-4 py-2 ml-2 transition duration-300 ease-in-out mr-2"
                htmlFor="my-modal-6"
                onClick={generateImage}
              >
                Generater Image
              </label>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 h-12 w-full p-4">
          <AuthStatus />
        </div>
      </div>
      <FooterBar />
      <Modal title={prompt} state={loadingState} url={imageUrl} error={errorState} />
    </>
  );
}
