import { Link } from "@reach/router";

function CustomLink({ isLink, to, children, ...rest }) {
    if (isLink) {
      return (
        <Link to={to} {...rest}>
          {children}
        </Link>
      );
    } else {
      return (
        <div {...rest}>
          {children}
        </div>
      );
    }
}

export default CustomLink;