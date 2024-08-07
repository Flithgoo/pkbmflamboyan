import { Link } from "react-scroll";

interface NavTypes {
  title: string;
  link: string;
  setActiveLink: (link: string) => void;
  activeLink: string;
}

const DesktopLink = ({ title, link, setActiveLink, activeLink }: NavTypes) => {
  return (
    <Link
      activeClass="active"
      to={`${link}`}
      spy={true}
      smooth={true}
      duration={1000}
      onSetActive={() => {
        setActiveLink(link);
      }}
      className={
        "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
        (activeLink === link
          ? " text-amber-500 animation-active "
          : " text-black-500 hover:text-amber-500 ")
      }
    >
      {title}
    </Link>
  );
};

export default DesktopLink;
