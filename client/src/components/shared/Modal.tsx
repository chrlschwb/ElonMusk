import React from 'react';
import Loading from './Loading';
import Image from './Image';
import NftMint, { NftProps } from '~/components/generator/NftMint';
import { useAuth } from '../auth';

type Props = {
  title: string;
  url: string;
  state: boolean;
  error: boolean;
};

function Modal({ title, state, url, error }: Props) {
  const auth = useAuth();
  const Nft: NftProps = {
    address: auth.user,
    imageUrl: url,
    price: 100,
  };

  return (
    <>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Generator {title}</h3>
          <p className="py-4">
            You've been selected for a chance to get one year of subscription to use Wikipedia for free!
          </p>
          <div className="justify-center text-center">
            {state ? <Loading /> : error ? <div>Sever error</div> : <Image url={url} />}
          </div>
          <div className="modal-action">
            <button className="btn" onClick={() => NftMint(Nft)}>
              Minted Token!
            </button>
            <label htmlFor="my-modal-6" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
