type Props = {
  url: string,
}

export default function Image({ url }: Props) {
  return <div className=" grid w-full h-full place-items-center">
    <img src={url} alt="Logo" className="rounded border-solid border-2 border-cyan-500" />
  </div>
}
