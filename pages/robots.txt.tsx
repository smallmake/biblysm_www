import React from "react";

const getRobots = () => {
  if (process.env.NEXT_PUBLIC_ROBOT_ALLOW === "true") {
    return `User-agent: *\nAllow: /`;
  } else {
    return `User-agent: *\nDisallow: /`;
  }
};

class Robots extends React.Component {
  static async getInitialProps({ res }) {
    res.setHeader("Content-Type", "text/plain");
    res.write(getRobots());
    res.end();
  }
}

export default Robots;