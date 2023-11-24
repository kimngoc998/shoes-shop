import React from 'react';
import SideMenu from "../layout/SideMenu";
import PropTypes from 'prop-types';

const MyComponent = props => (
    <div className="grid">
      <div className="main-content">
        <SideMenu>
          {props.children}
        </SideMenu>
      </div>
    </div>
  );
  
  MyComponent.propTypes = {
    children: PropTypes.node,
  };
  
  export default MyComponent;
