import React from "react";

class Link extends React.Component {
  render() {
    let {title, url, safe} = this.props.link;

    return (
      <div className="link">
        <a href={url} style={{"color": (safe ? "green" : "blue")}}>{title}</a>
      </div>
    );
  }
}

export default Link;
