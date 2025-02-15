import Image from "next/image";

export function MetaMaskIcon(props: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      <Image
        src="/metamask-icon.png"
        alt="MetaMask"
        width={24}
        height={24}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
