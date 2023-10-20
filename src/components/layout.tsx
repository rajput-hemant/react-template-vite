type Props = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return <div className="scroll-smooth antialiased">{children}</div>;
};

export default RootLayout;
