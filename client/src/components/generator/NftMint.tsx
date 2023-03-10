import React, { useState } from 'react';
import { AbiItem } from 'web3-utils';
import { nftAbi, nftAddress } from '~/contract/nft';
import Web3 from 'web3';
import { useAuth } from '../auth';
import Moralis from 'moralis/.';

export type NftProps = {
  address: string;
  price: number;
  imageUrl: string;
};

export default async function useNftMint({ address, price, imageUrl }: NftProps) {
  var test: boolean = false;
  const web3 = new Web3(Web3.givenProvider);
  const contract = new web3.eth.Contract(nftAbi as AbiItem[], nftAddress);

  await contract.methods
    .mint(address, 1, price, imageUrl)
    .send({ from: address, value: 10 })
    .then(() => {
      console.log('success nft create');
      test = true;
    })
    .catch(() => {
      console.log('error nft create');
      test = false;
    });
  return test;
}
