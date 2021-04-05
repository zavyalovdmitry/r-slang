import React, { Component } from "react";
const { Provider, Consumer } = React.createContext();

class UserContextProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "345345",
            jwt: 'fgmri4695jtkne'
        };
    }

  toggleUser = (id, jwt) => {
    this.setState({
        id: id, 
        jwt: jwt,
    });
  };

  render() {
    return (
      <Provider
        value={{ 
                id: this.state.id, 
                jwt: this.state.jwt,
                toggleUser: this.toggleUser 
                }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { UserContextProvider, Consumer as UserContextConsumer };
