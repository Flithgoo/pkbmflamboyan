import { Link } from "react-scroll";

interface NavTypes {
  title: string;
  link: string;
  close: any;
}

const MobileLink = ({ title, link, close }: NavTypes) => {
  return (
    <Link
      activeClass="active"
      to={`${link}`}
      smooth={true}
      duration={1000}
      onClick={() => close()}
      className={
        "cursor-pointer font-semibold block px-5 py-4 rounded-lg hover:bg-white/20"
      }
    >
      {title}
    </Link>
  );
};

export default MobileLink;
