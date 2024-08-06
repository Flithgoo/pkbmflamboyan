import Link from "next/link";
// import name from '';

const NavLink = ({ title, link, setActiveLink, activeLink }) => {
  return (
    <Link
      scroll={false}
      href={`#${link}`}
      onClick={() => {
        setActiveLink(link);
      }}
      className={
        "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
        (activeLink === link
          ? " text-orange-500 animation-active "
          : " text-black-500 hover:text-orange-500 a")
      }
    >
      {title}
    </Link>
  );
};

export default NavLink;
