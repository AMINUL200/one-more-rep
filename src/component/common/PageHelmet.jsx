import { Helmet } from "react-helmet";

const PageHelmet = ({ title }) => {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default PageHelmet;
